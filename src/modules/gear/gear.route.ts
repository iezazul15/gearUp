import { Router } from "express";
import { gearController } from "./gear.controller";

const router: Router = Router();

router.get("/", gearController.getGearItems);
router.get("/:id", gearController.getGearItemById);

export const gearRouter = router;
