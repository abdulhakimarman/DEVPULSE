import { Router } from "express";
import { sign } from "node:crypto";
import { signup } from "./auth.controllers";

const router = Router();

router.post("/signup", signup);
router.post("/login", (req, res) => {});

export default router;