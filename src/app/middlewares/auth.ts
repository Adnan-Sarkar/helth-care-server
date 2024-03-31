import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import AppError from "../error/AppError";
import httpStatus from "http-status";

const auth = (...userRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token as string,
        config.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      if (userRoles.length > 0 && !userRoles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
      } else {
        next();
      }
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;
