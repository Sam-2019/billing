import {
  getUser,
  getUsers,
  enableUser,
  createUser,
  disableUser,
  pingMikrotik,
  resetCounter,
} from "../services/mikrotik/index.js";
import { httpStatus } from "../config/constants.js";

class Mikrotik {
  async ping(req, res) {
    try {
      await pingMikrotik();
      res.status(httpStatus.OK).json({ message: "ping successful" });
    } catch (error) {
      console.error("ping failed:", error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
    }
  }

  async users(req, res) {
    try {
      const users = await getUsers();
      res
        .status(httpStatus.OK)
        .json({ data: users, message: "Users fetched successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error || "Failed to fetch users" });
    }
  }

  async user(req, res) {
    const results = req.body;

    if (!results || !results.userName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Username is required" });
    }
    const { userName } = results;
    try {
      const user = await getUser(userName);
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }
      res
        .status(httpStatus.OK)
        .json({ data: user, message: "User fetched successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error || "Failed to fetch user" });
    }
  }

  async disableUser(req, res) {
    const results = req.body;

    if (!results || !results.userName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Username is required" });
    }
    const { userName } = results;

    try {
      await disableUser(userName);
      res.status(httpStatus.OK).json({ message: "User disabled successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error || "Failed to disable user" });
    }
  }

  async enableUser(req, res) {
    const results = req.body;
    if (!results || !results.userName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Username is required" });
    }
    const { userName } = results;
    try {
      await enableUser(userName);
      res.status(httpStatus.OK).json({ message: "User enabled successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error || "Failed to enable user" });
    }
  }

  async addUser(req, res) {
    const results = req.body;
    if (
      !results ||
      !results.userName ||
      !results.password ||
      !results.profile
    ) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "Name, password and profile are required" });
    }

    try {
      const user = await createUser(results);
      res.status(201).json({ data: user, message: "User added successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error || "Failed to add user" });
    }
  }

  async resetUserCounter(req, res) {
    const results = req.body;
    if (!results || !results.userName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Username is required" });
    }

    const { userName } = results;
    try {
      await resetCounter(userName);
      res.status(httpStatus.OK).json({ message: "Counter reset successful" });
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error });
    }
  }
}

export { Mikrotik };
