import express, { NextFunction, Request, Response } from "express";
import { specialtiesController } from "./specialties.controller";
import uploadImage from "../../utils/uploadImage";

const router = express.Router();

router.get("/specialties", specialtiesController.getAllSpecialties);

router.post(
  "/",
  uploadImage.single("file"),
  // auth("SUPER_ADMIN", "ADMIN"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);

    return specialtiesController.createSpecialties(req, res, next);
  }
);

router.delete(
  "/specialties/:id",
  specialtiesController.deleteSingleSpecialtiesInfo
);

export const specialtiesRoutes = router;
