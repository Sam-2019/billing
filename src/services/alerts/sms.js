import { config } from "../../config/index.js";
import { addSms } from "../db/repository/sms.js";
import parsePhoneNumber from "libphonenumber-js";
import { smsContent, hubtel } from "../../config/constants.js";

export const sendSMS = async (data) => {
  const { senderid, clientid, clientsecret, uri } = config.sms;
  if (
    !senderid ||
    !clientid ||
    !clientsecret ||
    !uri ||
    !data.phoneNumber ||
    !data.fullName
  )
    return console.error("Error:", "Config missing!");

  const mobile = data.phoneNumber;
  const phoneNumber = parsePhoneNumber(mobile, "GH");

  if (!phoneNumber.isValid()) return;

  const url = new URL(uri);

  url.searchParams.append("from", senderid);
  url.searchParams.append("clientid", clientid);
  url.searchParams.append("content", smsContent);
  url.searchParams.append("to", phoneNumber.number);
  url.searchParams.append("clientsecret", clientsecret);

  try {
    const response = await fetch(url.toString());
    const results = await response.json();
    if (!results) return;
    const modData = {
      from: senderid,
      message: smsContent,
      payload: results,
      provider: hubtel.toUpperCase(),
      mobileNumber: phoneNumber.number,
    };
    await addSms(modData);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
