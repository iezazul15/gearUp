import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

const authorize =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource",
      );
    }

    next();
  };

export default authorize;
