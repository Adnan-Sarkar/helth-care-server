import express from "express";
import auth from "../../middlewares/auth";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.get(
  "/my-schedule",
  auth("DOCTOR"),
  doctorScheduleController.getDocotrSchedules
);

router.post("/", auth("DOCTOR"), doctorScheduleController.createDoctorSchedule);

export const doctorScheduleRoutes = router;
