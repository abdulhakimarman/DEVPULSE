import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { logger } from "./middleware/logger";
// import { globalErrorHandler } from "./middleware/globalErrorHandler";
// import authRoutes from "./api/routes/auth.route";

const app: Application = express();

app.use(logger);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  throw new Error("Test error");
  res.send("Hello, World!");
});
// app.use("/auth", authRoutes);
// app.use(globalErrorHandler);
export default app;
