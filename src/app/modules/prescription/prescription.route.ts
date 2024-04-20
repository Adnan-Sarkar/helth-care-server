import express from "express";
import auth from "../../middlewares/auth";
import { prescriptionController } from "./prescription.controller";

const router = express.Router();

router.post("/", auth("DOCTOR"), prescriptionController.createPrescription);

export const prescriptionRoutes = router;
