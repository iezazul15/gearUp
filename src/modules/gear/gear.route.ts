import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import { gearController } from "./gear.controller";

const router: Router = Router();

router.get("/", gearController.getGearItems);
router.get("/:id", gearController.getGearItemById);

router.post(
  "/",
  authenticate,
  authorize(Role.PROVIDER),
  gearController.createGearItem,
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.PROVIDER),
  gearController.updateGearItem,
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.PROVIDER),
  gearController.deleteGearItem,
);

export const gearRouter = router;
