import type { Response, NextFunction } from "express";
import type { Request } from "express";
import * as issueServices from "./issues.services";
import type { User } from "../../types";

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = req.user as User;
    const reporter_id = currentUser.id;
    const { title, description, type } = req.body;

    const result = await issueServices.createIssueIntoDB({ title, description, type, reporter_id });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort, type, status } = req.query;
    const result = await issueServices.getAllIssuesFromDB({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await issueServices.getSingleIssueFromDB(Number(id));

    if (!result) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = req.user as User;
    
    const issue = await issueServices.getSingleIssueFromDB(Number(id));
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    if (currentUser.role === "contributor") {
      if (issue.reporter?.id !== currentUser.id) {
        return res.status(403).json({ success: false, message: "You can only update your own issues" });
      }
      if (issue.status !== "open") {
        return res.status(403).json({ success: false, message: "Can only update issues when status is open" });
      }
    }

    const result = await issueServices.updateIssueInDB(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const issue = await issueServices.getSingleIssueFromDB(Number(id));
    
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    await issueServices.deleteIssueFromDB(Number(id));
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};