import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import { authController } from "./auth.controller";

const router: Router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", authenticate, authController.getMe);

router.patch("/me", authenticate, authController.updateMe);

router.post("/refresh-token", authController.refreshToken);

export const authRouter = router;
