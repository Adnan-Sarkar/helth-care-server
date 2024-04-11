import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorService } from "./doctor.service";

// get all doctors
const getAllDoctors = catchAsync(async (_req, res) => {
  const result = await doctorService.getAllDoctors();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all doctors successfully",
    data: result,
  });
});

// get doctor by id
const getSingleDoctorById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorService.getSingleDoctorById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all doctors successfully",
    data: result,
  });
});

export const doctorController = {
  getAllDoctors,
  getSingleDoctorById,
};