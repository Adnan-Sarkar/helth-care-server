import { Request } from "express";
import imageUploadToCloudinary from "../../utils/uploadImageIntoCloudinary";
import prisma from "../../utils/prismaClient";

// create specialties
const createSpecialties = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadFile = await imageUploadToCloudinary(file);
    req.body.icon = uploadFile.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

export const specialtiesService = {
  createSpecialties,
};
