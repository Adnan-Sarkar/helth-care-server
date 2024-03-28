import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../utils/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// get all admins
const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const pagination = pick(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const result = await adminServices.getAllAdminsFromDB(filters, pagination);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admins data retrived successfuly",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

// get admin by id
const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminServices.getAdminByIdFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data retrived successfuly",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// update admin by id
const updateAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminServices.updateAdminByIdIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data updated successfuly",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// delete admin by id
const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminServices.deleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin permanently deleted successfuly",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// soft delete admin by id
const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminServices.softDeleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin soft deleted successfuly",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const adminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  softDeleteAdmin,
};
