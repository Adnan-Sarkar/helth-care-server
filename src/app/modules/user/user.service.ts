import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../utils/prismaClient";
import { Request } from "express";
import imageUploadToCloudinary from "../../utils/uploadImageIntoCloudinary";
import { TFile } from "../../types/file";

// create admin
const createAdmin = async (req: Request) => {
  const file: TFile = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await imageUploadToCloudinary(file);
    req.body.data.admin.profilePhoto = uploadToCloudinary.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
