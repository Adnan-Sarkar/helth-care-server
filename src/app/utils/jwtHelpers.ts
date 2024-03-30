import jwt from "jsonwebtoken";

const generateToken = (payload: any, secret: string, expiresIn: string) => {
  return jwt.sign(
    {
      email: payload.email,
      role: payload.role,
    },
    secret,
    {
      expiresIn,
    }
  );
};

export const jwtHelpers = { generateToken };
