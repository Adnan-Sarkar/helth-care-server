import express from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = express.Router();

router.get("/", auth("SUPER_ADMIN", "ADMIN"), reviewController.createReview);

router.post("/", auth("PATIENT"), reviewController.createReview);

export const reviewRoutes = router;
