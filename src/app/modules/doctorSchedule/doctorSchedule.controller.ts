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

export const doctorScheduleController = { createDoctorSchedule };
