import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";

// create doctor schedule
const createDoctorSchedule = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.createDoctorSchedule(
    req?.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

// get doctor schedules
const getDocotrSchedules = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.getDocotrSchedules(req?.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedules retrived successfully",
    data: result,
  });
});

// get all doctor schedules
const getAllDocotrSchedules = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.getAllDocotrSchedules();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All doctor schedules retrived successfully",
    data: result,
  });
});

// delete doctor schedule
const deleteDoctorSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await doctorScheduleService.deleteDoctorSchedule(
    id,
    req?.user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedule deleted successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  createDoctorSchedule,
  getDocotrSchedules,
  deleteDoctorSchedule,
  getAllDocotrSchedules,
};
