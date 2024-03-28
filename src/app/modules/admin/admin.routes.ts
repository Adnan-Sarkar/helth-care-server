import express from "express";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getAdminById);

router.patch("/:id", adminControllers.updateAdminById);

export const adminRoutes = router;
