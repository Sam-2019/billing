import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    no: { type: Number, unique: true, required: true },
    serialNo: { type: String, unique: true, required: true },
    isConfigured: { type: Boolean, default: false },
    isAllocated: { type: Boolean, default: false },
    station: { type: String },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer"},
  },
  {
    timestamps: true,
  }
);

const Router = model("Router", dataSchema);
export default Router;
