import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { adminService } from "./admin.service";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await adminService.getAllUsers();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Users fetched successfully", users));
});

const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.updateUserStatus(
    req.params.id as string,
    req.body,
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "User status updated successfully", user));
});

const getAllGearItems = asyncHandler(async (req: Request, res: Response) => {
  const gearItems = await adminService.getAllGearItems();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Gear items fetched successfully", gearItems));
});

const getAllRentalOrders = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrders = await adminService.getAllRentalOrders();

  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(true, "Rental orders fetched successfully", rentalOrders),
    );
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGearItems,
  getAllRentalOrders,
};
