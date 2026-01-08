import { config } from "./index.js";
import { forbidden, unauthorized, httpStatus } from "./constants.js";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const AUTHORIZATION = config.authorization.bearer;

  if (
    !req.headers ||
    !authorization ||
    authorization.length === 0 ||
    authorization === "null" ||
    authorization === "undefined"
  ) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: unauthorized });
  }

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    const decodeToken = Buffer.from(token, "base64");
    const strinfigy = decodeToken.toString();

    if (strinfigy !== AUTHORIZATION) {
      return res.status(httpStatus.FORBIDDEN).json({ message: forbidden });
    }
  }

  next();
};