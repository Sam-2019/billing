import Bree from "bree";
import path from "path";
import mongoose from "mongoose";
import Graceful from "@ladjs/graceful";

async function startBree() {
  const bree = new Bree({
    removeCompleted: true,
    root: path.resolve("./src/services/jobs"),
    jobs: [
      {
        name: "provisionAccount",
        timeout: false,
        interval: "30m",
      },
      {
        name: "resetAccount",
        timeout: false,
        interval: "3m",
      },
      // {
      //   name: "provisionMember",
      //   timeout: false,
      //   interval: "3m",
      // },
    ],
    logger: console,
  });

  try {
    await bree.start();
    console.log("Bree started successfully. Jobs scheduled.");
  } catch (error) {
    console.error("Error starting Bree:", error);
  }

  const graceful = new Graceful({
    brees: [bree],
    mongooses: [mongoose],
  });
  graceful.listen();
}

export { startBree };
