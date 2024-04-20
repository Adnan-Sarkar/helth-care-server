import express from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth("PATIENT"), reviewController.createReview);

export const reviewRoutes = router;
