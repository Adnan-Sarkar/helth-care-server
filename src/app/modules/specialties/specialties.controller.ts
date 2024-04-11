import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { specialtiesService } from "./specialties.service";

// create specialties
const createSpecialties = catchAsync(async (req, res) => {
  const result = await specialtiesService.createSpecialties(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Create specialties successfully",
    data: result,
  });
});

// get all specialties
const getAllSpecialties = catchAsync(async (_req, res) => {
  const result = await specialtiesService.getAllSpecialties();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all specialties info successfully",
    data: result,
  });
});

// delete single specialties info
const deleteSingleSpecialtiesInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await specialtiesService.deleteSingleSpecialtiesInfo(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete single specialties info successfully",
    data: result,
  });
});

export const specialtiesController = {
  createSpecialties,
  getAllSpecialties,
  deleteSingleSpecialtiesInfo,
};
