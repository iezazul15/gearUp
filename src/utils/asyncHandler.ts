import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../types";

const asyncHandler =
  (fn: AsyncHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export default asyncHandler;
