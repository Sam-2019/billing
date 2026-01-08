import Registration from "../modelsXschema/registration.js";
import { excludeItems, registration } from "../../../config/constants.js";

const getRegistrations = async () => {
  return await Registration.find({}, excludeItems).lean();
};

const addRegistration = async (data) => {
  return await Registration.create(data);
};

const getRegistration = async (data) => {
  const email = data?.email;
  const userName = data?.userName;
  const phoneNumber = data?.phoneNumber;

  return await Registration.findOne(
    {
      email: email,
      phoneNumber: phoneNumber,
      registrationType: registration,
      "credentials.userName": userName,
    },
    excludeItems
  ).lean();
};

const getTodaysRegistrations = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await Registration
    .where('createdAt').gte(startOfDay).lte(endOfDay)
    .where('registrationType', /^Registration/i)
    .lean()
    
};

export { addRegistration, getRegistration, getRegistrations, getTodaysRegistrations };
