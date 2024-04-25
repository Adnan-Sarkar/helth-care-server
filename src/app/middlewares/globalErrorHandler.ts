import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const responseObject = {
    success: false,
    message: error?.message || error?.name || "Something went wrong!",
    error,
  };

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof ZodError) {
    responseObject.message = error?.issues
      .map((issue) => {
        return (issue.message as string).concat(".");
      })
      .join(" ");
    statusCode = httpStatus.BAD_REQUEST;
  }

  return res.status(statusCode).json(responseObject);
};

export default globalErrorHandler;
