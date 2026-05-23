import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import authRoute from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import issueRoute from "./modules/issues/issues.route";

const app: Application = express();

app.use(logger);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  //   throw new Error("Server is down");
  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
app.use(globalErrorHandler);

export default app;
