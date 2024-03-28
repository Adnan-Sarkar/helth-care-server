import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../utils/pick";
import { adminFilterableFields } from "./admin.constant";

// get all admins
const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const pagination = pick(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const result = await adminServices.getAllAdminsFromDB(filters, pagination);

    res.status(200).json({
      success: true,
      message: "Admins data retrived successfuly",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};

export const adminControllers = {
  getAllAdmins,
};
