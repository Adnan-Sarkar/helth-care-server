import { Request, Response } from "express";
import { userServices } from "./user.service";

// create admin
const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req.body);

    res.status(201).json({
      success: true,
      message: "Admin created successfuly",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};

export const userControllers = {
  createAdmin,
};
