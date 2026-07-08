import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { providerService } from "./provider.service";

const createGearItem = asyncHandler(async (req: Request, res: Response) => {
  const gearItem = await providerService.createGearItem(req.user.id, req.body);

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(true, "Gear item created successfully", gearItem));
});

const updateGearItem = asyncHandler(async (req: Request, res: Response) => {
  const gearItem = await providerService.updateGearItem(
    req.user.id,
    req.params.id as string,
    req.body,
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Gear item updated successfully", gearItem));
});

const deleteGearItem = asyncHandler(async (req: Request, res: Response) => {
  await providerService.deleteGearItem(req.user.id, req.params.id as string);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Gear item deleted successfully", null));
});

const getProviderOrders = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrders = await providerService.getProviderOrders(req.user.id);

  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(
        true,
        "Provider orders fetched successfully",
        rentalOrders,
      ),
    );
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrder = await providerService.updateOrderStatus(
    req.params.id as string,
    req.user.id,
    req.body,
  );

  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(
        true,
        "Rental order status updated successfully",
        rentalOrder,
      ),
    );
});

export const providerController = {
  createGearItem,
  updateGearItem,
  deleteGearItem,
  getProviderOrders,
  updateOrderStatus,
};
