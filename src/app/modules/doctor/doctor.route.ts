import express from "express";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.get("/", doctorController.getAllDoctors);

router.get("/:id", doctorController.getSingleDoctorById);

router.patch("/:id", doctorController.softDeleteSingleDoctor);

router.patch("/update/:id", doctorController.updateDoctor);

router.delete("/:id", doctorController.deleteSingleDoctor);

export const doctorRoutes = router;
