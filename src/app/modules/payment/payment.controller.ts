import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

// init payment
const initPayment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;

  const result = await paymentService.initPayment(appointmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

export const paymentController = { initPayment };