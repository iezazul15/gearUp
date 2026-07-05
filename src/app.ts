import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import config from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api", router);

app.use(globalErrorHandler);

export default app;
