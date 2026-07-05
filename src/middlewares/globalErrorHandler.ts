import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  console.log(err);

  if (err instanceof ApiError) {
    const { statusCode, message, errors } = err;
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  if (err instanceof Error) {
    const { message } = err;
    return res.status(500).json({
      success: false,
      message,
      errors: [],
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};

export default globalErrorHandler;
