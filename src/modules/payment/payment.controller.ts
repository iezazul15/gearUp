import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { paymentService } from "./payment.service";

const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const { rentalOrderId } = req.body;

    const result = await paymentService.createPaymentIntent(
      req.user.id,
      rentalOrderId,
    );

    return res
      .status(httpStatus.CREATED)
      .json(new ApiResponse(true, "Payment intent created", result));
  },
);

const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { tran_id, order_id, status } = req.query;
  const payload = req.body;

  if (!tran_id || !order_id || !status) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(new ApiResponse(false, "Missing required query parameters"));
  }

  const result = await paymentService.handleVerification(
    tran_id as string,
    order_id as string,
    status as string,
    payload,
  );

  return res
    .status(result?.code!)
    .json(new ApiResponse(true, result?.message!, null));
});

const getPayments = asyncHandler(async (req: Request, res: Response) => {
  const payments = await paymentService.getPayments(req.user.id);
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Payments fetched", payments));
});

const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(
    req.user.id,
    req.params.id as string,
  );
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Payment fetched", payment));
});

export const paymentController = {
  createPaymentIntent,
  verifyPayment,
  getPayments,
  getPaymentById,
};
