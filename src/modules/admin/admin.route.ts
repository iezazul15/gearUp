import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import { adminController } from "./admin.controller";

const router: Router = Router();

router.get(
  "/users",
  authenticate,
  authorize(Role.ADMIN),
  adminController.getAllUsers,
);

router.patch(
  "/users/:id",
  authenticate,
  authorize(Role.ADMIN),
  adminController.updateUserStatus,
);

router.get(
  "/gear",
  authenticate,
  authorize(Role.ADMIN),
  adminController.getAllGearItems,
);

router.get(
  "/rentals",
  authenticate,
  authorize(Role.ADMIN),
  adminController.getAllRentalOrders,
);

export const adminRouter = router;
