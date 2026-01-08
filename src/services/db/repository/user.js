import User from "../modelsXschema/user.js";

const getUser = async () => {
  return await User.find({});
};

const addUser = async (data) => {
  return await User.create(data);
};

const findUser = async (email) => {
  return await User.findOne({
    email: email,
  });
};

export { getUser, addUser, findUser };
