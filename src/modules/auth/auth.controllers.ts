import type { Request, Response } from "express";
import authServices from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import { signToken, verifyToken } from "../../utils/jwt";

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
  res.cookie("refreshToken", refreshToken, {
    sameSite: "lax",
    httpOnly: true,
    secure: false,
  });
  const result = {
    user: user,
    accessToken,
    refreshToken,
  };
  sendResponse(
    res,
    { message: "User created successfully!", data: result },
    201,
  );
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return sendResponse(res, { message: "Refresh token not found" }, 401);
  }
  const payload = verifyToken(refreshToken, "refresh");
  if (!payload) {
    return sendResponse(res, { message: "Invalid refresh token" }, 401);
  }
  const user = await authServices.getUserById(payload.id);
  if (!user) {
    return sendResponse(res, { message: "User not found" }, 404);
  }
  const { accessToken, refreshToken: newRefreshToken } = signToken(user);
  res.cookie("refreshToken", newRefreshToken, {
    sameSite: "lax",
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    message: "Token refreshed successfully!",
    data: { accessToken, newRefreshToken },
  });
  console.log(user);
};
