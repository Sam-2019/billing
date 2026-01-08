import "dotenv/config";

const config = {
  server: {
    port: process.env.PORT,
    uri: process.env.SERVER_URL,
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
  google: {
    uri: process.env.GOOGLE_SCRIPTS,
  },
  authorization: {
    bearer: process.env.AUTHORIZATION,
  },
  gateway: {
    clientid: process.env.MERCHANT,
    token: process.env.BASIC_AUTH,
    url: process.env.TRANSACTION_STATUS_CHECK_URL,
  },
  mikrotik: {
    port: process.env.MIKROTIK_PORT,
    host: process.env.MIKROTIK_HOST,
    username: process.env.MIKROTIK_USERNAME,
    password: process.env.MIKROTIK_PASSWORD,
    server: process.env.MIKROTIK_DEFAULT_SERVER || "hotspot1",
  },
  admin: {
    role: process.env.USER_ROLE,
    email: process.env.USER_EMAIL,
    userID: process.env.USER_ID,
    fullName: process.env.USER_NAME,
    password: process.env.USER_PASSWORD,
  },
  session: {
    salt: process.env.SALT,
    secret: process.env.SESSION_SECRET,
    crypto: process.env.SESSION_CRYPTO_SECRET,
    collection: process.env.SESSION_COLLECTION,
    ttl: 14 * 24 * 60 * 60
  },
  cookie: {
    name: process.env.COOKIE_NAME,
    password: process.env.COOKIE_PASSWORD,
  },
};

export { config };
