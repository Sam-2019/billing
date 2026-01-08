import Customer from "../modelsXschema/customer.js";
import { excludeItems } from "../../../config/constants.js";

const getCustomers = async () => {
    return await Customer.find({}, excludeItems).lean();
};

const addCustomer = async (data) => {
    return await Customer.create(data);
};

const getCustomer = async (data) => {
    const email = data?.email;
    const userName = data?.userName;
    const phoneNumber = data?.phoneNumber;

    return await Customer.findOne(
        {
            "credentials.userName": userName,
            phoneNumber: phoneNumber,
            email: email,
        },
        excludeItems
    ).lean();
};

const getUnprovisionedCustomer = async () => {
    return await Customer.findOne({ profileCreated: false })
};

const updateProfileCreated = async (user) => {
    const query = { "credentials.userName": userName };
    return await Customer.findOneAndUpdate(query, { profileCreated: true }, {
        new: true
    });
}

export { getCustomers, addCustomer, getCustomer, getUnprovisionedCustomer, updateProfileCreated };