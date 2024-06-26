import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { Request } from "express";

const login = catchAsync(async (req, res) => {
  const loginData = await authServices.login(req.body);

  const { refreshToken, ...result } = loginData;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const token = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generate successfuly",
    data: token,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await authServices.changePassword(req.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sent reset password link successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";

  const result = await authServices.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

export const authController = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
