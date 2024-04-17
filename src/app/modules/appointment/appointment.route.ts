import express from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/my-appointment",
  auth("PATIENT", "DOCTOR"),
  appointmentController.getMyAppointment
);

router.post("/", auth("PATIENT"), appointmentController.createAppointment);

export const appointmentRoutes = router;
