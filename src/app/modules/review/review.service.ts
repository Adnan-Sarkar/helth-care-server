import httpStatus from "http-status";
import AppError from "../../error/AppError";
import prisma from "../../utils/prismaClient";

// create review
const createReview = async (user: any, payload: any) => {
  const { appointmentId, rating, comment } = payload;

  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
  });

  if (!(patientData.id === appointmentData.patientId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const review = await prisma.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.doctorId,
        rating,
        comment,
      },
    });

    const avgRating = await transactionClient.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: review.doctorId,
      },
    });

    await transactionClient.doctor.update({
      where: {
        id: review.doctorId,
      },
      data: {
        avgRating: avgRating._avg.rating as number,
      },
    });

    return review;
  });

  return result;
};

// get all reviews
const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      appointment: true,
      doctor: true,
      patient: true,
    },
  });

  return result;
};

export const reviewService = {
  createReview,
  getAllReviews,
};
