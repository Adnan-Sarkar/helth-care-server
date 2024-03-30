import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

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

export const authController = {
  login,
};
