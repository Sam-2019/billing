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
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    dateTime: { type: Date, default: Date.now() },
    credentials: { type: Object },
    provider: { type: String },
    providerResponse: { type: Object },
    registrationType: { type: String },
    purchaseInfo: { type: Object },
  },
  {
    timestamps: true,
  }
);

const FailedRegistration = model("FailedRegistration", dataSchema);
export default FailedRegistration;