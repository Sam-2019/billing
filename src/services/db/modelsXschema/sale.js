import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    fullName: { type: String },
    phoneNumber: { type: String },
    subscriptionPlan: { type: String },
    planFee: { type: Number },
    registrationFee: { type: Number },
    totalCost: { type: Number },
    clientReference: { type: String },
    email: { type: String, lowercase: true },
    dateTime: { type: Date, default: Date.now() },
    provider: { type: String },
    providerResponse: { type: Object },
    registrationType: { type: String },
    purchaseInfo: { type: Object },
    transactionId: { type: String },
    externalTransactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Sale = model("Sales", dataSchema);
export default Sale;