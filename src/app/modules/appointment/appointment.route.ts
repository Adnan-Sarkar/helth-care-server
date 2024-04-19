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

router.patch(
  "/status/:id",
  auth("DOCTOR", "ADMIN", "SUPER_ADMIN"),
  appointmentController.updateAppointmentStatus
);

export const appointmentRoutes = router;
