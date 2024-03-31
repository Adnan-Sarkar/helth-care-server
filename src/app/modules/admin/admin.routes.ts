import express from "express";
import { adminControllers } from "./admin.controller";
import validateRequet from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth("SUPER_ADMIN", "ADMIN"), adminControllers.getAllAdmins);

router.get("/:id", auth("SUPER_ADMIN", "ADMIN"), adminControllers.getAdminById);

router.patch(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  validateRequet(adminValidations.updateValidationSchema),
  adminControllers.updateAdminById
);

router.delete(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  adminControllers.deleteAdmin
);

router.delete(
  "/soft/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  adminControllers.softDeleteAdmin
);

export const adminRoutes = router;
