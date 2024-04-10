import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import uploadImage from "../../utils/uploadImage";
import { userValidations } from "./user.validation";
import validateRequet from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", auth("SUPER_ADMIN", "ADMIN"), userControllers.getAllusers);

router.get("/me", auth("SUPER_ADMIN", "ADMIN"), userControllers.getMyProfile);

router.post(
  "/create-admin",
  auth("SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"),
  uploadImage.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    return userControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth("SUPER_ADMIN", "ADMIN"),
  uploadImage.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    return userControllers.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  uploadImage.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    return userControllers.createPatient(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth("SUPER_ADMIN", "ADMIN"),
  validateRequet(userValidations.updateUserStatusValidationSchema),
  userControllers.updateUserStatus
);

router.patch(
  "/update-my-profile",
  auth("SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT"),
  uploadImage.single("file"),
  auth("SUPER_ADMIN", "ADMIN"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    return userControllers.updateMyProfile(req, res, next);
  }
);

export const userRoutes = router;
