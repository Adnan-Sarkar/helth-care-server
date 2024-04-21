import express from "express";
import { metaController } from "./meta.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth("ADMIN", "DOCTOR", "PATIENT", "SUPER_ADMIN"),
  metaController.getDashboardMetaData
);

export const metaRoutes = router;
