import mongoose from "mongoose";
import process from "node:process";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../alerts/ntfy.js";
import { sendSMS } from "../alerts/sms.js";
import { connectDB } from "../db/index.js";
import { createUser, getUser } from "../mikrotik/index.js";
import { findCustomerSale } from "../db/repository/sale.js";
import { dataPlans, smsContent } from "../../config/constants.js";
import { getUnprovisionMember } from "../db/repository/membership.js";

const graceful = new Graceful({
    mongooses: [mongoose],
});

graceful.listen();

const provisionMember = async () => {
    try {
        console.log(`[${new Date().toISOString()}] provisionMember job started.`);
        await connectDB();

        const member = await getUnprovisionMember();
        if (!member) return;

        const sale = await findCustomerSale(member);
        if (!sale) return;

        const selectedPlan = dataPlans.MEMBERSHIP;
        const results = {
            userName: member?.credentials?.userName,
            password: member?.credentials?.password,
            email: member?.email,
            profile: selectedPlan.name,
            limitUptime: selectedPlan.uptimeSub,
            disabled: true
        };

        const memberStatus = await getUser(results?.userName);

        if (memberStatus && member?.profileCreated === false) {
            member.profileCreated = true;
            member.mktID = memberStatus?.id;
            await member.save();
            await ntfy({
                payload: `👍🏾 Member updated: ${results?.userName} - ${memberStatus?.id}`,
            });
            return;
        }

        const user = await createUser(results);
        member.profileCreated = true;
        member.mktID = user?.id;
        await member.save();
        await sendSMS(member, smsContent.registration);
        await ntfy({payload: `👍🏾 Member Provisioned: ${member?.fullName} - ${results?.userName} - ${user?.id}`});

    } catch (error) {
        const message = `🤬 Account Member: ${error}`;
        await ntfy({ payload: message });
        console.error(message);
    } finally {
        console.log(`[${new Date().toISOString()}] provisionMember job finished.`);
        process.exit(0);
    }
};

await provisionMember();
