import type { Request, Response } from "express";
import authServices from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";

export const signup = async (req: Request, res: Response) => {
  const user = await authServices.createUser(req.body);
  if (!user) {
    return sendResponse(res, { message: "Failed to create user" }, 400);
  }
  sendResponse(res, { message: "User created successfully!", data: user }, 201);
};
