import prisma from "../../utils/prismaClient";
import bcrypt from "bcrypt";
import { jwtHelpers } from "./../../utils/jwtHelpers";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../config";

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
    decodedData = jwtHelpers.verifyToken(token, "refresh_secret") as JwtPayload;
  } catch (error: any) {
    throw new Error("You are not authorized!");
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

export const authServices = {
  login,
  refreshToken,
};
