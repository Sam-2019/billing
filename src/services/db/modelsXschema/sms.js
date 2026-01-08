import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    mobileNumber: {
      type: String,
    },
    message: {
      type: String,
    },
    from: {
      type: String,
    },
    provider: {
      type: String,
    },
    payload: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Sms = model("SmsReceipt", dataSchema);
export default Sms;