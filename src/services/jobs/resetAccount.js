import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { getActiveTopup } from "../db/repository/topup.js";
import { getMember } from "../db/repository/membership.js";
import { getUser, resetCounter } from "../mikrotik/index.js";
import { getSelectedPlan, parseUptimeToSeconds } from "../../config/constants.js";

const graceful = new Graceful({
  mongooses: [mongoose],
});

graceful.listen();

const resetAccount = async () => {
  try {
    console.log(`[${new Date().toISOString()}] resetCounter job started.`);
    await connectDB();

    const customer = await getActiveTopup();
    if (!customer) return;

    // grab member info
    const profile = await getMember(customer.credentials)
    const userName = customer?.credentials?.userName;

    const plan = customer?.subscriptionPlan;
    const selectedPlan = getSelectedPlan(plan);
    const planUptime = selectedPlan?.uptime;
    const planUptimeSeconds = parseUptimeToSeconds(planUptime);

    const user = await getUser(userName);
    if (!user) return;
    const userUptime = user?.uptime;
    const userUptimeSeconds = parseUptimeToSeconds(userUptime);

    const userInfo = {
      id: user?.id,
      uptime: user?.uptime,
      userName: userName,
      fullName: customer?.fullName,
    };

  
    // use grabbed member info

    if (userUptimeSeconds < planUptimeSeconds) return;

    const state = await resetCounter(userInfo.id);
    if (state === true) {
      customer.status = "expired";
      await customer.save();
      const message = `👍🏾 Reset Counter: ${userInfo.fullName} - ${userInfo.userName}`;
      await ntfy({ payload: message });
    }
  } catch (error) {
    const message = `🤬 Reset Counter: ${error}`;
    await ntfy({ payload: message });
    console.error(message);
  } finally {
    console.log(`[${new Date().toISOString()}] resetCounter job finished.`);
    process.exit(0);
  }
};

await resetAccount();
