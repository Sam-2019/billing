import { model, Schema } from "mongoose";

const dataSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "restricted"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", dataSchema);
export default User;