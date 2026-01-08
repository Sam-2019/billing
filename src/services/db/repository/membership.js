import Membership from "../modelsXschema/membership.js";
import { excludeItems } from "../../../config/constants.js";

const getMemberships = async () => {
  return await Membership.find({}, excludeItems).lean();
};

const getMember = async (data) => {
  const userName = data?.userName;
  return await Membership.find({
    "credentials.userName": userName,
  }, excludeItems).lean();
};

const addMembership = async (data) => {
  return await Membership.create(data);
};

const getActiveMember = async () => {
  return await Membership.findOne({ status: "active" }).lean();
};

const getDisabledMember = async () => {
  return await Membership.findOne({ status: "diasbled" }).lean();
};

const getUnprovisionMember = async () => {
  return await Membership.findOne({ profileCreated: "false" }).lean();
};

export { getMemberships, getMember, addMembership, getActiveMember, getDisabledMember, getUnprovisionMember };
