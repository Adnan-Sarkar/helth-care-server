import express from "express";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", doctorController.getAllDoctors);

router.get("/:id", doctorController.getSingleDoctorById);

export const doctorRoutes = router;
