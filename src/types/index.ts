import { NextFunction, Request, Response } from "express";

export type Meta = {
  page?: number;
  limit?: number;
  total?: number;
};

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
