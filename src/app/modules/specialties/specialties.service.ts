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

// get all specialties
const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany();

  return result;
};

// delete single specialties info
const deleteSingleSpecialtiesInfo = async (id: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.specialties.delete({
    where: {
      id,
    },
  });

  return null;
};

export const specialtiesService = {
  createSpecialties,
  getAllSpecialties,
  deleteSingleSpecialtiesInfo,
};
