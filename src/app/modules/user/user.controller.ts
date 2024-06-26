import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../middlewares/catchAsync";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfuly",
    data: result,
  });
});

// create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor created successfuly",
    data: result,
  });
});

// create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient created successfuly",
    data: result,
  });
});

// get all users
const getAllusers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const pagination = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userServices.getAllUsersFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Users data retrived successfuly",
    meta: result.meta,
    data: result.data,
  });
});

// update user status
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.updateUserStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated users profile status successfuly",
    data: result,
  });
});

// get my profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getMyProfile(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data fetched",
    data: result,
  });
});

// update my profile
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateMyProfile(req.user, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile updated successfully",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllusers,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
