import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { jwtUtils } from "../utils/jwt";

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized: Invalid or missing token",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_token_secret,
    );

    req.user = {
      id: verifiedToken.id,
      name: verifiedToken.name,
      email: verifiedToken.email,
      role: verifiedToken.role,
    };

    next();
  },
);

export default authenticate;
