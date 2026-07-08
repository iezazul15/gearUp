import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import { providerController } from "./provider.controller";

const router: Router = Router();

router.post(
  "/gear",
  authenticate,
  authorize(Role.PROVIDER),
  providerController.createGearItem,
);

router.put(
  "/gear/:id",
  authenticate,
  authorize(Role.PROVIDER),
  providerController.updateGearItem,
);

router.delete(
  "/gear/:id",
  authenticate,
  authorize(Role.PROVIDER),
  providerController.deleteGearItem,
);

router.get(
  "/orders",
  authenticate,
  authorize(Role.PROVIDER),
  providerController.getProviderOrders,
);

router.patch(
  "/orders/:id",
  authenticate,
  authorize(Role.PROVIDER),
  providerController.updateOrderStatus,
);

export const providerRouter = router;
