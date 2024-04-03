import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import uploadImage from "../../utils/uploadImage";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get("/", userControllers.getAllusers);

router.post(
  "/create-admin",
  auth("SUPER_ADMIN", "ADMIN"),
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

export const userRoutes = router;
