import express from "express";
import { Mikrotik } from "../controllers/mikrotik.js";
import { authMiddleware } from "../config/middleware.js";

const controller = new Mikrotik();

// API routes for Mikrotik user management
const mikrotikRouter = express.Router();

// Ping mikrotik
// Endpoint: GET /api/mikrotik
// Returns current state of mikrotik
mikrotikRouter.get("/mikrotik", authMiddleware, controller.ping);

// Get a specific user by userName
// Endpoint: GET /api/mikrotik/user
// Returns the user details for the specified userName
mikrotikRouter.get("/mikrotik/user", authMiddleware, controller.user);

// Get all users
// Endpoint: GET /api/mikrotik/users
// Returns a list of all users in the Mikrotik hotspot
mikrotikRouter.get("/mikrotik/users", authMiddleware, controller.users);

// Add a new user
// Endpoint: POST /api/mikrotik/user/add
// Adds a new user to the Mikrotik hotspot with the provided details
mikrotikRouter.post("/mikrotik/user/add", authMiddleware, controller.addUser);

// Enable a user
// Endpoint: POST /api/mikrotik/user/enable
// Enables the specified user in the Mikrotik hotspot
mikrotikRouter.post("/mikrotik/user/enable", authMiddleware, controller.enableUser);

// Disable a user
// Endpoint: POST /api/mikrotik/user/disable
// Disables the specified user in the Mikrotik hotspot
mikrotikRouter.post("/mikrotik/user/disable", authMiddleware, controller.disableUser);

// Reset user counter
// Endpoint: POST /api/mikrotik/user/resetCounter
// Resets a user's counter to enable new session
mikrotikRouter.post("/mikrotik/user/resetCounter", authMiddleware, controller.resetUserCounter);

export default mikrotikRouter;
