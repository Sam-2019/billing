import mongoose from "mongoose";
import process from "node:process";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { createUser, getUser } from "../mikrotik/index.js";
import { getSelectedPlan } from "../../config/constants.js";
import { findCustomerSale } from "../db/repository/sale.js";
import { getUnprovisionedCustomer } from "../db/repository/customer.js";

const graceful = new Graceful({
  mongooses: [mongoose],
});

graceful.listen();

const provisionAccount = async () => {
  try {
    console.log(`[${new Date().toISOString()}] accountProvision job started.`);
    await connectDB();

    const customer = await getUnprovisionedCustomer();
    if (!customer) return;

    const customerSale = await findCustomerSale(customer);
    if (!customerSale) return;

    const selectedPlan = getSelectedPlan(customerSale?.subscriptionPlan);
    const results = {
      userName: customer?.credentials?.userName,
      password: customer?.credentials?.password,
      email: customer?.email,
      profile: selectedPlan.name,
      limitUptime: selectedPlan.uptimeSub,
    };

    const customerStatus = await getUser(results?.userName);

    if (customerStatus && customer?.profileCreated === false) {
      customer.profileCreated = true;
      customer.mktID = customerStatus?.id;
      await customer.save();
      await ntfy({
        payload: `👍🏾 Profile updated ${results?.userName} - ${customerStatus?.id}`,
      });
      return;
    }

    const createdUser = await createUser(results);
    customer.profileCreated = true;
    customer.mktID = createdUser?.id;
    await customer.save();
    await ntfy({
      payload: `👍🏾 Account Provision: ${customer?.fullName} - ${results?.userName}`,
    });
  } catch (error) {
    const message = `🤬 Account Provision: ${error}`;
    await ntfy({ payload: message });
    console.error(message);
  } finally {
    console.log(`[${new Date().toISOString()}] accountProvision job finished.`);
    process.exit(0);
  }
};

await provisionAccount();
