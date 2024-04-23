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

// validate payment
const validatePyment = catchAsync(async (req, res) => {
  const result = await paymentService.validatePyment(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});

// get all unpaid payments
const getAllUnpaidPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getAllUnpaidPayments();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Getting all unpaid payments successfully",
    data: result,
  });
});

export const paymentController = {
  initPayment,
  validatePyment,
  getAllUnpaidPayments,
};
