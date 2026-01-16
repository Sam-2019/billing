import "dotenv/config";

const config = {
  server: {
    port: process.env.PORT,
  },
  database: {
    uri: process.env.DB_URL,
    name: process.env.DB_NAME,
  },
  notify: {
    uri: process.env.NTFY_URL,
    topic: process.env.NTFY_TOPIC,
    auth: process.env.NTFY_AUTHORIZATION,
  },
  mikrotik: {
    port: process.env.MIKROTIK_PORT,
    host: process.env.MIKROTIK_HOST,
    username: process.env.MIKROTIK_USERNAME,
    password: process.env.MIKROTIK_PASSWORD,
    server: process.env.MIKROTIK_DEFAULT_SERVER || "hotspot1",
  }
};

export { config };