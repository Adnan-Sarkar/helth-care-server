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

export const doctorService = {
  getAllDoctors,
  getSingleDoctorById,
};
