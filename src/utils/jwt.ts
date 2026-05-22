import config from "../config";
import type { RUser } from "../types";
import jwt from "jsonwebtoken";

export const signToken = (payload: RUser & { id: number }) => {
  const accessToken = jwt.sign(payload, config.jwtSecretKey, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, config.refreshTokenSecretKey, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};
