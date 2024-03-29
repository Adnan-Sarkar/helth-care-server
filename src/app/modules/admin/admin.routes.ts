import express from "express";
import { adminControllers } from "./admin.controller";
import validateRequet from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";

const router = express.Router();

router.get("/", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getAdminById);

router.patch(
  "/:id",
  validateRequet(adminValidations.updateValidationSchema),
  adminControllers.updateAdminById
);

router.delete("/:id", adminControllers.deleteAdmin);

router.delete("/soft/:id", adminControllers.softDeleteAdmin);

export const adminRoutes = router;
