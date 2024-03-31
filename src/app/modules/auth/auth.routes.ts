import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post(
  "/change-password",
  auth("ADMIN", "SUPER_ADMIN", "DOCTOR", "PATIENT"),
  authController.changePassword
);

export const authRoutes = router;
