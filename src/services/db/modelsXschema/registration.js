import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    regID: { type: String },
    fullName: { type: String },
    phoneNumber: { type: String },
    subscriptionPlan: { type: String },
    planFee: { type: Number },
    registrationFee: { type: Number },
    totalCost: { type: Number },
    clientReference: { type: String },
    email: { type: String, lowercase: true },
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: Date, default: Date.now() },
    credentials: {
      userName: {
        type: String,
      },
      password: {
        type: String,
      },
    },
    provider: { type: String },
    registrationType: { type: String },
    purchaseInfo: { type: Object },
  },
  {
    timestamps: true,
  }
);

const Registration = model("Registration", dataSchema);
export default Registration;