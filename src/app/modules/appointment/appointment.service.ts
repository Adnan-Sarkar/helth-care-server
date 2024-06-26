import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { TPaginationOptions } from "../../types/pagination";
import { generatePaginationAndSorting } from "../../utils/generatePaginationAndSorting";
import prisma from "../../utils/prismaClient";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

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

// update appointment status
const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: any
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (!(user?.email === appointmentData.doctor.email)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This is not your appointment"
      );
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointmentData.id,
    },
    data: {
      status,
    },
  });

  return result;
};

// cancel unpaid appointments
const cancelUnpaidAppointments = async () => {
  const thirtyMinAge = new Date(Date.now() - 30 * 60 * 1000);

  const unPaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinAge,
      },
      paymentStatus: "UNPAID",
    },
  });

  const appointmentIdsToCancel = unPaidAppointments.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (transactionClient) => {
    // delete payments
    await transactionClient.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });

    // delete appointments
    await transactionClient.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });

    for (const unpaidAppointment of unPaidAppointments) {
      await transactionClient.doctorSchedules.updateMany({
        where: {
          doctorId: unpaidAppointment.doctorId,
          scheduleId: unpaidAppointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const appointmentService = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
  cancelUnpaidAppointments,
};
