import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";
import { ntfy } from "../alerts/ntfy.js";
import { connectDB } from "../db/index.js";
import { getUser, topupUser } from "../mikrotik/index.js";
import { getActiveTopup } from "../db/repository/topup.js";
import { dataPlans, getSelectedPlan, parseUptimeToSeconds } from "../../config/constants.js";

const graceful = new Graceful({
    mongooses: [mongoose],
});

graceful.listen();

const topupMember = async () => {
    try {
        console.log(`[${new Date().toISOString()}] topupMember job started.`);
        await connectDB();

        const customer = await getActiveTopup();
        if (!customer) return;

        const userName = customer?.credentials?.userName;
        const selectedPlan = getSelectedPlan(customer?.subscriptionPlan);
        const selectedPlanUptime = selectedPlan?.uptime;
        const selectedPlanUptimeSeconds = parseUptimeToSeconds(selectedPlanUptime);

        const user = await getUser(userName);
        if (!user) return console.error(`Mikrotik: user-${userName} not found`);
        const currentLimitUptime = user?.limitUptime;
        const currentLimitUptimeSeconds = parseUptimeToSeconds(currentLimitUptime);

        const userInfo = {
            id: user?.id,
            userName: userName,
            fullName: customer?.fullName,
            userLimitUptime: currentLimitUptime
        };

        const newLimitUptimeSeconds = currentLimitUptimeSeconds + selectedPlanUptimeSeconds;
        const newLimitUptime = newLimitUptimeSeconds/dataPlans.DAILY.uptimeSeconds

        const limit = { duration: selectedPlanUptime, newLimitUptimeSeconds: newLimitUptimeSeconds };
        const oldLimit = `${currentLimitUptime}/${currentLimitUptimeSeconds}s`
        const topupLimit = `${selectedPlanUptime}/${selectedPlanUptimeSeconds}s`
        const newLimit = `${newLimitUptime}/${newLimitUptimeSeconds}s`

        console.log(`📈 Top-up for ${userInfo.fullName}:`);
        console.log(`   Old Limit: ${oldLimit || "Unlimited"}`);
        console.log(`   Adding: ${topupLimit}`);
        console.log(`   New Limit Uptime: ${newLimit}`);

        const state = await topupUser({ userID: user?.id, limit: limit });
        if (state === true) {
            customer.status = "expired";
            customer.mikrotikTopupDate = Date.now();
            customer.uptimeLimitBeforeTopup = `${currentLimitUptimeSeconds}s`;
            customer.uptimeLimitAfterTopup = `${newLimitUptimeSeconds}s`;
            await customer.save();
            const message = `✅ Topup Complete: ${userInfo.fullName} - ${userInfo.userName}`;
            await ntfy({ payload: message });
        }
    }
    catch (err) {
        const message = `🤬 Topup Account: ${err}`;
        await ntfy({ payload: message });
        console.error(message);
    } finally {
        console.log(`[${new Date().toISOString()}] topupMember job finished.`);
        process.exit(0);
    }
}

await topupMember()
