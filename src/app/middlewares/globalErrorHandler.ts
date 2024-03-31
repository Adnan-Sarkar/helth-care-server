import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error?.message || error?.name || "Something went wrong!",
    error,
  });
};

export default globalErrorHandler;
