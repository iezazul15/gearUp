import { Request, Response, Router } from "express";
import httpStatus from "http-status";
import { authRouter } from "../modules/auth/auth.route";
import { categoryRouter } from "../modules/category/category.route";
import { gearRouter } from "../modules/gear/gear.route";
import { rentalOrderRouter } from "../modules/rentalOrder/rentalOrder.route";
import { reviewRouter } from "../modules/review/review.route";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const router: Router = Router();

// Root route to check if the server is running
router.get(
  "/",
  asyncHandler((req: Request, res: Response) => {
    res.json(new ApiResponse(true, "Server is running", null));
  }),
);

/**
 * Other Routes
 */
router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/gear", gearRouter);
router.use("/rentals", rentalOrderRouter);
router.use("/reviews", reviewRouter);

// Handle 404 errors for undefined routes
router.use(
  asyncHandler((req: Request, res: Response) => {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Requested ${req.originalUrl} not found`,
      ["The requested resource was not found on this server."],
    );
  }),
);

export default router;
