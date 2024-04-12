import prisma from "../../utils/prismaClient";

// get all doctors
const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany();

  return result;
};

// get doctor by id
const getSingleDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

// delete single doctor
const deleteSingleDoctor = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.doctor.delete({
    where: {
      id,
    },
  });

  return null;
};

// soft delete single doctor
const softDeleteSingleDoctor = async (id: string) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.doctor.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return null;
};

export const doctorService = {
  getAllDoctors,
  getSingleDoctorById,
  deleteSingleDoctor,
  softDeleteSingleDoctor,
};
