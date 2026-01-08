import Router from "../modelsXschema/router.js";

const getRouters = async () => {
  return await Router.find({});
};

const addRouter = async (data) => {
  return await Router.create(data);
};

const findRouter = async (serialNo) => {
  return await Router.findOne({
    serialNo: serialNo,
  });
};

const allocateRouter = async ({ station, customerId }) => {
  const query = { isConfigured: true, isAllocated: false, station: station };
  return await Router.findOneAndUpdate(query, {
    customerId: customerId,
  });
};

export { getRouters, addRouter, findRouter, allocateRouter };
