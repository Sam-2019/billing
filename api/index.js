import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import express, { json } from "express";
import responseTime from "response-time";
import requestId from "express-request-id";
import router from "../src/routes/index.js";
import requestReceived from "request-received";
import { __dirname } from "../src/config/constants.js";
import { connectDB } from "../src/services/db/index.js";
import { startBree } from "../src/services/jobs/index.js";

const port = process.env.PORT || 4000;

const start = async () => {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    })
  );
  await connectDB();

  app.use(json());

  app.use(requestReceived);
  app.use(responseTime());
  app.use(requestId());
  app.use("/", router);
  app.use(bodyParser.json());
  app.disable("x-powered-by");
  app.use(express.static(path.join(__dirname, "/public")));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
    });
  });
};

await start();
await startBree();
