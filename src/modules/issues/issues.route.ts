import express from "express";
import * as issueControllers from "./issues.controllers";
import { auth, authorizeRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/", 
  auth, 
  authorizeRole(["contributor", "maintainer"]), 
  issueControllers.createIssue
);

router.get("/", issueControllers.getAllIssues);

router.get("/:id", issueControllers.getSingleIssue);

router.patch(
  "/:id", 
  auth, 
  authorizeRole(["contributor", "maintainer"]), 
  issueControllers.updateIssue
);

router.delete(
  "/:id", 
  auth, 
  authorizeRole(["maintainer"]), 
  issueControllers.deleteIssue
);

export default router;