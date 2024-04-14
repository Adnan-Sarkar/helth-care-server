import { MedicalReport, Patient, PatientHealthData } from "@prisma/client";
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

  await prisma.$transaction(async (transactionClient) => {
    // delete patient health data
    await transactionClient.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    // delete patient medical reports
    await transactionClient.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // delete patient
    const deletedPatientData = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    // delete user
    await transactionClient.user.delete({
      where: {
        email: deletedPatientData.email,
      },
    });
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

// update single patient
const updateSinglePatient = async (
  id: string,
  payload: Partial<
    Patient & { patientHealthData: PatientHealthData } & {
      medicalReport: MedicalReport;
    }
  >
) => {
  const { patientHealthData, medicalReport, ...patientInfo } = payload;

  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientInfo,
    });

    // create or update patient health data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientData.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientData.id },
      });
    }

    // create or update patient medical report
    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientData.id },
      });
    }
  });

  return await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
};

export const patientService = {
  getAllPatients,
  getSinglePatient,
  deleteSinglePatient,
  softDeleteSinglePatient,
  updateSinglePatient,
};
