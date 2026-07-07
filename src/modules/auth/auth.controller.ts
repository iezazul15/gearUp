import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { authService } from "./auth.service";

const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);
  const response = new ApiResponse(true, "User registered successfully", user);
  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(true, "User registered successfully", user));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const userData = await authService.loginUser(req.body);

  res.cookie("accessToken", userData.tokens.accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  res.cookie("refreshToken", userData.tokens.refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "User logged in successfully", userData));
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user.id);
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "User Profile fetched successfully", user));
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshToken(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return res.status(httpStatus.OK).json(
    new ApiResponse(true, "Token refreshed successfully", {
      accessToken,
      refreshToken: newRefreshToken,
    }),
  );
});

export const authController = {
  register,
  login,
  getMe,
  refreshToken,
};
