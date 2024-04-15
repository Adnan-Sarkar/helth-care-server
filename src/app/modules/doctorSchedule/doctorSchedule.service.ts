import httpStatus from "http-status";
import AppError from "../../error/AppError";
import prisma from "../../utils/prismaClient";

// create doctor schedule
const createDoctorSchedule = async (
  user: any,
  payload: { scheduleIds: string[] }
) => {
  const { scheduleIds } = payload;

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorSchedulesData = scheduleIds.map((scheduleId) => {
    return {
      doctorId: doctorData.id,
      scheduleId,
    };
  });

  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedulesData,
  });

  return result;
};

// get doctor schedules
const getDocotrSchedules = async (user: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.doctorSchedules.findMany({
    where: {
      doctorId: doctorData.id,
    },
  });

  return result;
};

// delete doctor schedule
const deleteDoctorSchedule = async (id: string, user: any) => {
  const docotrData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: docotrData.id,
      scheduleId: id,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new AppError(httpStatus.BAD_REQUEST, "Schedule is already booked!");
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: docotrData.id,
        scheduleId: id,
      },
    },
  });
};

export const doctorScheduleService = {
  createDoctorSchedule,
  getDocotrSchedules,
  deleteDoctorSchedule,
};
