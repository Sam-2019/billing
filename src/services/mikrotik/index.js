import RouterOSClient from "ros-client";
import { ntfy } from "../alerts/ntfy.js";
import { config } from "../../config/index.js";

const mikrotikCredentials = {
  port: config.mikrotik.port,
  host: config.mikrotik.host,
  username: config.mikrotik.username,
  password: config.mikrotik.password,
};

const api = new RouterOSClient({
  ...mikrotikCredentials,
  tls: false,
});

const modifiedUser = (user) => {
  return {
    id: user[0]?.[".id"] || null,
    name: user[0]?.name,
    server: user[0]?.server,
    profile: user[0]?.profile,
    limitUptime: user[0]?.["limit-uptime"],
    uptime: user[0]?.["uptime"],
    bytesIn: user[0]?.["bytes-in"],
    bytesOut: user[0]?.["bytes-out"],
    packetsIn: user[0]?.["packets-in"],
    packetsOut: user[0]?.["packets-out"],
    dynamic: user[0]?.dynamic,
    disabled: user[0]?.disabled,
    comment: user[0]?.comment,
  };
};

const pingMikrotik = async () => {
  try {
    return await api.connect();
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const getUsers = async () => {
  try {
    await api.connect();
    const users = await api.send(["/ip/hotspot/user/print"]);
    await api.close();
    return users;
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const getUser = async (userName) => {
  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/print",
      `?name=${userName}`,
    ]);
    await api.close();

    if (user.length === 0) {
      return null;
    }
    return modifiedUser(user);
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const disableUser = async (userName) => {
  try {
    await api.connect();
    await api.send([
      "/ip/hotspot/user/set",
      `=.id=${userName}`,
      "=disabled=true",
    ]);
    await api.close();
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const enableUser = async (userName) => {
  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/set",
      `=.id=${userName}`,
      "=disabled=false",
    ]);
    await api.close();
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const resetCounter = async (userID) => {
  try {
    await api.connect();
    await api.send(["/ip/hotspot/user/reset-counters", `=.id=${userID}`]);
    await api.close();
    return true;
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const createUser = async (userData) => {
  const defaultMikrotikServer = config.mikrotik.server;
  const comment = `Automated-${new Date().toISOString()}`;

  try {
    await api.connect();
    const user = await api.send([
      "/ip/hotspot/user/add",
      `=name=${userData?.userName}`,
      `=email=${userData?.email}`,
      `=profile=${userData?.profile}`,
      `=password=${userData?.password}`,
      `=limit-uptime=${userData?.limitUptime}`,
      `=comment=${comment}`,
      `=server=${defaultMikrotikServer}`,
    ]);
    await api.close();
    return modifiedUser(user);
  } catch (err) {
    console.error({ "err": err.message })
    await ntfy({ payload: "MIKROTIK: PING FAILED" });
  }
};

const topupUser = async ({userID, limit}) => {
  const { newLimitUptimeSeconds, duration } = limit;
  const comment = `Topup ${duration} added on ${new Date().toISOString()}`;
  
  try {
    await api.connect();

    // 4. Update the user record
    await api.send([ "/ip/hotspot/user/set", `=.id=${userID}`, `=limit-uptime=${newLimitUptimeSeconds}s`, `=comment=${comment}`, ]);

    const active = await api.send([ "/ip/hotspot/active/print", `?user=${userID}`]);

    // if user is active?
    // remove session
    if (active.length > 0) {
      await api.send([ "/ip/hotspot/active/remove", `=.id=${userID}`]);
      console.log("⚡ Active session refreshed. New limit applied.");
    }

    await api.close();
    return true
  } catch (err) {
    console.error({ "❌ Top-up Error:": err.message });
    await ntfy({ payload: "MIKROTIK: ❌ TOP_UP ERROR" });
  }
}

export {
  getUser,
  getUsers,
  topupUser,
  createUser,
  enableUser,
  disableUser,
  pingMikrotik,
  resetCounter,
  modifiedUser,
  api as mikrotikAPI,
};
