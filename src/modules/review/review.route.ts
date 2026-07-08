import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import { reviewController } from "./review.controller";

const router: Router = Router();

router.post(
  "/",
  authenticate,
  authorize(Role.CUSTOMER),
  reviewController.createReview,
);

export const reviewRouter = router;
