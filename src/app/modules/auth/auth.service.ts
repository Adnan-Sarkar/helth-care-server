import prisma from "../../utils/prismaClient";
import bcrypt from "bcrypt";
import { jwtHelpers } from "./../../utils/jwtHelpers";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import emailSender from "../../utils/sendEmail";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// login
const login = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password is incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    userData,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );
  const refreshToken = jwtHelpers.generateToken(
    userData,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES_IN as string
  );

  return {
    needPasswordChange: userData.needPasswordChange,
    token: accessToken,
    refreshToken,
  };
};

// refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
  } catch (error: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    userData,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );

  return accessToken;
};

// change password
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: "ACTIVE",
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return null;
};

// forgot password
const forgotPassword = async (payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    { email: payload.email },
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );

  const resetPasswordLink = `http://localhost:3000/api/v1/auth/reset-password?userId=${userData.id}&token=${resetPasswordToken}`;

  await emailSender(
    userData.email,
    `
      <div>
        <p>Dear User,</p>
        <p>
          Your password reset link
          <a href=${resetPasswordLink} >
            <button>Reset Password</button>
          </a>
        </p>
      </div>
    `
  );

  return null;
};

// reset password
const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: "ACTIVE",
    },
  });

  try {
    jwtHelpers.verifyToken(
      token,
      config.JWT_ACCESS_SECRET as string
    ) as JwtPayload;
  } catch (error: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return null;
};

export const authServices = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
