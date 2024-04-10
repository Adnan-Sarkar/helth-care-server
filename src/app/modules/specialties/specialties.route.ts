import express from "express";
import { specialtiesController } from "./specialties.controller";

const router = express.Router();

router.post("/", specialtiesController.createSpecialties);

export const specialtiesRoutes = router;
