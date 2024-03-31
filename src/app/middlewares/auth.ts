import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const auth = (...userRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token as string,
        config.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      if (userRoles.length > 0 && !userRoles.includes(verifiedUser.role)) {
        throw new Error("You are not authorized!");
      } else {
        next();
      }
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;
