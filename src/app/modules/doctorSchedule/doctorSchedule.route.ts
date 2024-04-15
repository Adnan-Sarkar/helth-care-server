import express from "express";
import auth from "../../middlewares/auth";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.post("/", auth("DOCTOR"), doctorScheduleController.createDoctorSchedule);

export const doctorScheduleRoutes = router;
