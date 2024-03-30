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

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const jwtHelpers = { generateToken, verifyToken };
