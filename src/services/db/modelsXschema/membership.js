import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    fullName: { type: String },
    phoneNumber: { type: String },
    email: { type: String, lowercase: true, unique: true },
    dateOfBirth: { type: Date },
    blockCourt: { type: String },
    roomType: { type: String },
    roomNumber: { type: String },
    isCustodian: { type: Boolean, default: false },
    credentials: {
      userName: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    cardPrinted: { type: Boolean, default: false },
    profileCreated: { type: Boolean, default: false },
    studentId: { type: String, unique: true },
    status: { type: String, default: "disabled" },
    mktID: { type: String, },
  },
  {
    timestamps: true,
  }
);

const Membership = model("Membership", dataSchema);
export default Membership;
