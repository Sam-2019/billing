import Topup from "../modelsXschema/topup.js";
import { excludeItems } from "../../../config/constants.js";

const excludeActiveItems = {
  subscriptionPlan: 0,
  email: 0,
  purchaseInfo: 0,
  createdAt: 0,
  updatedAt: 0,
  __v: 0,
};

const getTopups = async () => {
  return await Topup.find({}, excludeItems).lean();
};

const addTopup = async (data) => {
  return await Topup.create(data);
};

const getActiveTopup = async () => {
  return await Topup.findOne({ status: "active" }).sort({
    createdAt: -1,
  });
};

export { getTopups, addTopup, getActiveTopup };
