import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { prescriptionService } from "./prescription.service";

// create prescription
const createPrescription = catchAsync(async (req, res) => {
  const result = await prescriptionService.createPrescription(
    req?.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

export const prescriptionController = {
  createPrescription,
};
