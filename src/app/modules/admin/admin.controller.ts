import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";

// get all admins
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const pagination = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await adminServices.getAllAdminsFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins data retrived successfuly",
    meta: result.meta,
    data: result.data,
  });
});

// get admin by id
const getAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await adminServices.getAdminByIdFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data retrived successfuly",
      data: result,
    });
  }
);

// update admin by id
const updateAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await adminServices.updateAdminByIdIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data updated successfuly",
      data: result,
    });
  }
);

// delete admin by id
const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await adminServices.deleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin permanently deleted successfuly",
      data: result,
    });
  }
);

// soft delete admin by id
const softDeleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await adminServices.softDeleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin soft deleted successfuly",
      data: result,
    });
  }
);

export const adminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  softDeleteAdmin,
};
