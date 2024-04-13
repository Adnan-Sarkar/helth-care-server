import prisma from "../../utils/prismaClient";

// get all patients
const getAllPatients = async () => {
  const result = await prisma.patient.findMany({
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
};

// get single patient
const getSinglePatient = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

// delete single patient
const deleteSinglePatient = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.patient.delete({
    where: {
      id,
    },
  });

  return null;
};

// delete single patient
const softDeleteSinglePatient = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.patient.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return null;
};

export const patientService = {
  getAllPatients,
  getSinglePatient,
  deleteSinglePatient,
  softDeleteSinglePatient,
};
