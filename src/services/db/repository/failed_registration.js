import { excludeItems } from "../../../config/constants.js";
import FailedRegistration from "../modelsXschema/failed_registration.js";

const getFailedRegistrations = async () => {
  return await FailedRegistration.find({}, excludeItems).lean();
};

const addFailedRegistration = async (data) => {
  return await FailedRegistration.create(data);
};

const getFailedRegistration = async (data) => {
  const email = data?.email;
  const phoneNumber = data?.phoneNumber;

  return await FailedRegistration.findOne(
    {
      email: email,
      phoneNumber: phoneNumber,
    },
    excludeItems
  ).lean();
};

export {
  addFailedRegistration,
  getFailedRegistration,
  getFailedRegistrations,
};
