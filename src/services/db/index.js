import mongoose from "mongoose";
import MongoStore from "connect-mongo";
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

const dbSession = {
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: config.database.uri,
    collectionName: config.session.collection,
    dbName: config.database.name,
    stringify: false,
    ttl: config.session.ttl,
    crypto: { secret: config.session.crypto },
  }),
};

export { connectDB, disconnectDB, dbSession };
