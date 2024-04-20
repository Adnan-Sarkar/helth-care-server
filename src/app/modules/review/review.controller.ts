import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";

// create review
const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req?.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
