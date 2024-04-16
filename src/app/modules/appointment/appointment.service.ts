import prisma from "../../utils/prismaClient";
import { v4 as uuidv4 } from "uuid";

// create an appointment
const createAppointment = async (user: any, payload: any) => {
  const { doctorId, scheduleId } = payload;

  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
    },
  });

  const doctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (transactionClient) => {
    const appointmentData = await transactionClient.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: doctorScheduleData.scheduleId,
        videoCallingId,
      },
    });

    await transactionClient.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: scheduleId,
        },
      },
      data: {
        appointmentId: appointmentData.id,
        isBooked: true,
      },
    });

    return appointmentData;
  });

  return await prisma.appointment.findUniqueOrThrow({
    where: {
      id: result.id,
    },
    include: {
      doctor: true,
      patient: true,
      schedule: true,
    },
  });
};

export const appointmentService = { createAppointment };
