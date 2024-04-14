import express from "express";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get("/", patientController.getAllPatients);

router.get("/:id", patientController.getSinglePatient);

router.delete("/:id", patientController.deleteSinglePatient);

router.delete("/soft/:id", patientController.softDeleteSinglePatient);

router.patch("/:id", patientController.updateSinglePatient);

export const patientRoutes = router;
