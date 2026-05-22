import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";
import authServices from "../modules/auth/auth.services";
import type { Role } from "../types";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendResponse(res, { message: "Unauthorized", error: true }, 401);
  }

  const payload = verifyToken(authHeader, "access");

  if (!payload) {
    return sendResponse(res, { message: "Unauthorized", error: true }, 401);
  }

  const user = await authServices.getUserById(payload.id);
  if (!user) {
    return sendResponse(res, { message: "Unauthorized", error: true }, 401);
  }
  req.user = user;
  next();
};

export const authorizeRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, { message: "Unauthorize", error: true }, 403);
    }
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, { message: "Forbidden", error: true }, 403);
    }
    return next();
  };
};
