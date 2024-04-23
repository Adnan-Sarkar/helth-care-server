import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth("SUPER_ADMIN", "ADMIN"),
  paymentController.getAllUnpaidPayments
);

router.get("/ipn", paymentController.validatePyment);

router.post("/init-payment/:appointmentId", paymentController.initPayment);

export const paymentRoutes = router;
