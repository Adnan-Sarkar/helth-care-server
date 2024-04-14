import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";

// create schedule
const createSchedule = catchAsync(async (req, res) => {
  const result = await scheduleService.createSchedule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

export const scheduleController = { createSchedule };
