import mongoose from "mongoose";
import { config } from "../../config/index.js";

const dbConn = mongoose.connection;
dbConn.on("connected", () => {
  console.log("Mongoose connected");
});

const connectDB = async () => {
  await mongoose.connect(config.database.uri, {
    dbName: config.database.name,
    autoIndex: true,
  });
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log("Mongoose disconnected");
};

export { connectDB, disconnectDB };