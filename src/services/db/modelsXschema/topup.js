import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    fullName: { type: String },
    phoneNumber: { type: String },
    subscriptionPlan: { type: String },
    planFee: { type: Number },
    clientReference: { type: String },
    email: { type: String, lowercase: true },
    credentials: { type: Object },
    purchaseInfo: { type: Object },
    transactionId: { type: String },
    externalTransactionId: { type: String },
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
  }
);

const Topup = model("Topups", dataSchema);
export default Topup;