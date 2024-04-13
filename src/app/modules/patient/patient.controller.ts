import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { patientService } from "./patient.service";

// get all patients
const getAllPatients = catchAsync(async (req, res) => {
  const result = await patientService.getAllPatients();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients data retrieval successfully",
    data: result,
  });
});

// get single patient
const getSinglePatient = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await patientService.getSinglePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient data retrieval successfully",
    data: result,
  });
});

// delete single patient
const deleteSinglePatient = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await patientService.deleteSinglePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient permanently deleted successfully",
    data: result,
  });
});

// delete single patient
const softDeleteSinglePatient = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await patientService.softDeleteSinglePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

export const patientController = {
  getAllPatients,
  getSinglePatient,
  deleteSinglePatient,
  softDeleteSinglePatient,
};
