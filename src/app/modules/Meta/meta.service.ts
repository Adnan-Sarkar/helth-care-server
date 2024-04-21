import { UserRole } from "@prisma/client";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import prisma from "../../utils/prismaClient";

// get meta data
const getDashboardMetaData = async (user: any) => {
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return await getSuperAdminMetaData();

    case UserRole.ADMIN:
      return await getAdminMetaData();

    case UserRole.DOCTOR:
      return await getDoctorMetaData(user);

    case UserRole.PATIENT:
      return await getPatientMetaData(user);
  }
};

// get superAdmin meta data
const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const adminCount = await prisma.admin.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
    },
  });

  return {
    appointmentCount,
    adminCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};

// get admin meta data
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
    },
  });

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};

// get doctor meta data
const getDoctorMetaData = async (user: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: "PAID",
    },
  });

  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });

  const appointmentsStatusDistribution = appointmentStatusData.map(
    (appointment) => {
      return {
        status: appointment.status,
        count: Number(appointment._count.id),
      };
    }
  );

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue,
    appointmentsStatusDistribution,
  };
};

// get patient meta data
const getPatientMetaData = async (user: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentsStatusDistribution = appointmentStatusData.map(
    (appointment) => {
      return {
        status: appointment.status,
        count: Number(appointment._count.id),
      };
    }
  );

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    appointmentsStatusDistribution,
  };
};

export const metaService = { getDashboardMetaData };
