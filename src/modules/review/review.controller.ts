import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { reviewService } from "./review.service";

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user.id, req.body);

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(true, "Review created successfully", review));
});

export const reviewController = {
  createReview,
};
