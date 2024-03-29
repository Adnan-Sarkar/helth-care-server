import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateRequet = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default validateRequet;
