import Feedback from "../modelsXschema/feedback.js";

const getFeedback = async () => {
  return await Feedback.find({});
};

const addFeedback = async (data) => {
  return await Feedback.create(data);
};

export { getFeedback, addFeedback };
