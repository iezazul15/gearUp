import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/enums";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";
import { categoryController } from "./category.controller";

const router: Router = Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.get(
  "/admin/all",
  authenticate,
  authorize(Role.ADMIN),
  categoryController.getAllCategoriesForAdmin,
);

router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  categoryController.deleteCategory,
);

export const categoryRouter = router;
