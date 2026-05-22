import type { Request, Response } from "express";
import authServices from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  const user = await authServices.createUser(req.body);
  if (!user) {
    return sendResponse(res, { message: "Failed to create user" }, 400);
  }
  sendResponse(res, { message: "User created successfully!", data: user }, 201);
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authServices.validateUser(email, password);
  if (!user) {
    return sendResponse(res, { message: "Invalid email or password" }, 401);
  }
  const { accessToken, refreshToken } = signToken(user);
  const result = {
    user: user,
    accessToken,
    refreshToken,
  }
    sendResponse(res, { message: "User created successfully!", data: result }, 201);
};
