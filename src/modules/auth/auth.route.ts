import { Router } from "express";
import { login, refresh, signup } from "./auth.controllers";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);

export default router;
