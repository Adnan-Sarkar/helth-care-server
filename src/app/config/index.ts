import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  APP_PASSWORD: process.env.APP_PASSWORD,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID,
  SSLCOMMERZ_STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD,
  SSLCOMMERZ_SEASSON_API_URL: process.env.SSLCOMMERZ_SEASSON_API_URL,
  SSLCOMMERZ_SUCCES_URL: process.env.SSLCOMMERZ_SUCCES_URL,
  SSLCOMMERZ_FAIL_URL: process.env.SSLCOMMERZ_FAIL_URL,
  SSLCOMMERZ_CANCEL_URL: process.env.SSLCOMMERZ_CANCEL_URL,
  SSLCOMMERZ_VALIDATION_API_URL: process.env.SSLCOMMERZ_VALIDATION_API_URL,
  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,
};
