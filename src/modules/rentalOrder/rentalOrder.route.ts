import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import { rentalOrderController } from "./rentalOrder.controller";

const router: Router = Router();

router.post(
  "/",
  authenticate,
  authorize(Role.CUSTOMER),
  rentalOrderController.createRentalOrder,
);

router.get(
  "/",
  authenticate,
  authorize(Role.CUSTOMER),
  rentalOrderController.getRentalOrders,
);

router.get(
  "/:id",
  authenticate,
  authorize(Role.CUSTOMER),
  rentalOrderController.getRentalOrderById,
);

router.get(
  "/admin/all",
  authenticate,
  authorize(Role.ADMIN),
  rentalOrderController.getAllRentalOrdersForAdmin,
);

export const rentalOrderRouter = router;
