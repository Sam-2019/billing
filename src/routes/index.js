import path from "path";
import express from "express";
import apiRouter from "./api.js";
import { __dirname, httpStatus } from "../config/constants.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    res.status(httpStatus.OK);
    res.sendFile(path.join(`${__dirname}/public/up.html`));
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.sendFile(path.join(`${__dirname}/public/down.html`));
  }
});
router.use("/api", apiRouter);

export default router;
