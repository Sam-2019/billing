import Sms from "../modelsXschema/sms.js";

const getSms = async () => {
  return await Sms.find({});
};

const addSms = async (data) => {
  return await Sms.create(data);
};

const findSms = async (id) => {
  return await Sms.findOne({
    id: id,
  });
};

export { getSms, addSms, findSms };
