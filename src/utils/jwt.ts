import config from "../config";
import type { RUser } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secretKey =
    type === "access" ? config.jwtSecretKey : config.refreshTokenSecretKey;
  const decode = jwt.verify(token, secretKey) ;
  return decode as JwtPayload;
};

export const signToken = (payload: RUser & { id: number }) => {
  const accessToken = jwt.sign(payload, config.jwtSecretKey, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, config.refreshTokenSecretKey, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};
