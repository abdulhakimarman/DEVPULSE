import { Router } from "express";
import { sign } from "node:crypto";
import { login, signup } from "./auth.controllers";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
