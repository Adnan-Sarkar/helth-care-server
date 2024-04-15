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

export const doctorScheduleService = {
  createDoctorSchedule,
};
