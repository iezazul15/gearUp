import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import { paymentController } from "./payment.controller";

const router: Router = Router();

router.post("/create", authenticate, paymentController.createPaymentIntent);
router.post("/callback", paymentController.verifyPayment);
router.get("/", authenticate, paymentController.getPayments);
router.get("/:id", authenticate, paymentController.getPaymentById);

export const paymentRouter = router;
