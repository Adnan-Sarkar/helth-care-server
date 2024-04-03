import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../middlewares/catchAsync";

// create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);

  res.status(201).json({
    success: true,
    message: "Admin created successfuly",
    data: result,
  });
});

// create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);

  res.status(201).json({
    success: true,
    message: "Doctor created successfuly",
    data: result,
  });
});

// create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);

  res.status(201).json({
    success: true,
    message: "Patient created successfuly",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
};
