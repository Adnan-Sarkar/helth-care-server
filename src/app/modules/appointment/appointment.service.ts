import { Prisma, UserRole } from "@prisma/client";
import { TPaginationOptions } from "../../types/pagination";
import { generatePaginationAndSorting } from "../../utils/generatePaginationAndSorting";
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

    const today = new Date();
    const transactionId = `helthcare-${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDay()}-${today.getMilliseconds}`;

    await transactionClient.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
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

// get my appointment
const getMyAppointment = async (
  user: any,
  filters: any,
  options: TPaginationOptions
) => {
  const { limit, skip, sortObj, page } = generatePaginationAndSorting(options);
  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  const userRole =
    user.role === UserRole.PATIENT ? UserRole.PATIENT : UserRole.DOCTOR;

  andConditions.push({
    [userRole]: {
      email: user.email,
    },
  });

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((filed) => ({
        [filed]: {
          equals: (filterData as any)[filed],
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortObj,
    include: {
      doctor: userRole === UserRole.DOCTOR,
      patient: userRole === UserRole.PATIENT,
      schedule: true,
    },
  });

  const total = await prisma.appointment.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const appointmentService = { createAppointment, getMyAppointment };
