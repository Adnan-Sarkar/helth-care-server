import express from "express";
import auth from "../../middlewares/auth";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.get(
  "/my-schedule",
  auth("DOCTOR"),
  doctorScheduleController.getDocotrSchedules
);

router.get(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  doctorScheduleController.getAllDocotrSchedules
);

router.post("/", auth("DOCTOR"), doctorScheduleController.createDoctorSchedule);

router.delete(
  "/:id",
  auth("DOCTOR"),
  doctorScheduleController.deleteDoctorSchedule
);

export const doctorScheduleRoutes = router;
