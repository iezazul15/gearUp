import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { gearService } from "./gear.service";

const getGearItems = asyncHandler(async (req: Request, res: Response) => {
  const { gearItems, meta } = await gearService.getGearItems(req.query);

  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(true, "Gear items fetched successfully", gearItems, meta),
    );
});

const getGearItemById = asyncHandler(async (req: Request, res: Response) => {
  const gearItem = await gearService.getGearItemById(req.params.id as string);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Gear item fetched successfully", gearItem));
});

const createGearItem = asyncHandler(async (req: Request, res: Response) => {
  const gearItem = await gearService.createGearItem(req.user.id, req.body);

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(true, "Gear item created successfully", gearItem));
});

const updateGearItem = asyncHandler(async (req: Request, res: Response) => {
  const gearItem = await gearService.updateGearItem(
    req.user.id,
    req.params.id as string,
    req.body,
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Gear item updated successfully", gearItem));
});

const deleteGearItem = asyncHandler(async (req: Request, res: Response) => {
  await gearService.deleteGearItem(req.user.id, req.params.id as string);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Gear item deleted successfully", null));
});

export const gearController = {
  getGearItems,
  getGearItemById,
  createGearItem,
  updateGearItem,
  deleteGearItem,
};
