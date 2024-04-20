import httpStatus from "http-status";
import AppError from "../../error/AppError";
import prisma from "../../utils/prismaClient";

// create prescription
const createPrescription = async (user: any, payload: any) => {
  const { appointmentId, instructions, followUpDate } = payload;

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
      status: "COMPLETED",
      paymentStatus: "PAID",
    },
    include: {
      doctor: true,
    },
  });

  if (!(user?.email === appointmentData.doctor.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      PatientId: appointmentData.patientId,
      instructions,
      followUpDate: followUpDate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

// get my prescriptions
const getMyPrescriptions = async (user: any) => {
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });

  return result;
};

export const prescriptionService = {
  createPrescription,
  getMyPrescriptions,
};
