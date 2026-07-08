import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { rentalOrderService } from "./rentalOrder.service";

const createRentalOrder = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrder = await rentalOrderService.createRentalOrder(
    req.user.id,
    req.body,
  );

  return res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(true, "Rental order created successfully", rentalOrder),
    );
});

const getRentalOrders = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrders = await rentalOrderService.getRentalOrdersByCustomer(
    req.user.id,
  );

  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(true, "Rental orders fetched successfully", rentalOrders),
    );
});

const getRentalOrderById = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrder = await rentalOrderService.getRentalOrderById(
    req.params.id as string,
    req.user.id,
  );

  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(true, "Rental order fetched successfully", rentalOrder),
    );
});

const getProviderOrders = asyncHandler(async (req: Request, res: Response) => {
  const rentalOrders = await rentalOrderService.getProviderRentalOrders(
    req.user.id,
  );

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

const getAllRentalOrdersForAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const rentalOrders = await rentalOrderService.getAllRentalOrdersForAdmin();

    return res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(
          true,
          "Rental orders fetched successfully",
          rentalOrders,
        ),
      );
  },
);

const updateRentalOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const rentalOrder = await rentalOrderService.updateRentalOrderStatus(
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
  },
);

export const rentalOrderController = {
  createRentalOrder,
  getRentalOrders,
  getRentalOrderById,
  getProviderOrders,
  getAllRentalOrdersForAdmin,
  updateRentalOrderStatus,
};
