import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { appointmentService } from "./appointment.service";
import pick from "../../utils/pick";

// create an appointment
const createAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.createAppointment(
    req?.user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment booked successfully",
    data: result,
  });
});

// get my appointment
const getMyAppointment = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await appointmentService.getMyAppointment(
    req?.user,
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My appointment retrive successfully",
    data: result,
  });
});

// update appointment status
const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await appointmentService.updateAppointmentStatus(
    id,
    req.body.status,
    req.?user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update appointment status successfully",
    data: result,
  });
});

export const appointmentController = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
};
