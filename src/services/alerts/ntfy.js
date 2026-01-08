import { config } from "../../config/index.js";

const priority = 4;
const topic = config.notify.topic;

const setupAlert = (title, message) => {
  return {
    topic: topic,
    title: title,
    priority: priority,
    message: message,
  };
};

export const ntfy = async ({ payload }) => {
  if (!config.notify.uri || !config.notify.topic || !config.notify.auth) return;
  if (!route) return;
  if (!payload) return;

  if (!payload) {
    console.error("Payload is required for ntfy notification.");
    return;
  }

  const beforeColon = /^(.*?)(?=:)/gm;
  const afterColon = /(?<=: )(.*)/gm;

  const title = payload.match(beforeColon);
  const message = payload.match(afterColon);
  const alert = setupAlert(title[0], message[0]);

  await fetch(config.notify.uri, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.notify.auth}`,
    },
    body: JSON.stringify(alert),
  });
};
