import { Doctor } from "@prisma/client";
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

// update single doctor
const updateDoctor = async (
  id: string,
  payload: Partial<
    Doctor & { specialties: [{ specialtiesId: string; isDeleted: boolean }] }
  >
) => {
  const { specialties, ...doctorData } = payload;

  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updatedDoctorInfo = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    if (specialties && specialties.length > 0) {
      const deleteSpecialtiesIdList = specialties.filter(
        (specialties) => specialties.isDeleted
      );

      deleteSpecialtiesIdList?.forEach(async (specialty) => {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorData.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      });

      const createSpecialtiesIdList = specialties.filter(
        (specialties) => !specialties.isDeleted
      );

      createSpecialtiesIdList?.forEach(async (specialty) => {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: updatedDoctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      });
    }

    return updatedDoctorInfo;
  });

  return await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: true,
    },
  });
};

export const doctorService = {
  getAllDoctors,
  getSingleDoctorById,
  deleteSingleDoctor,
  softDeleteSingleDoctor,
  updateDoctor,
};
