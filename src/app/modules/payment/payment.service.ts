import config from "../../config";
import prisma from "../../utils/prismaClient";
import { SSLService } from "../SSL/ssl.service";
import axios from "axios";

// init payment
const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findUniqueOrThrow({
    where: {
      appointmentId: appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    tran_id: paymentData.transactionId,
    cus_name: paymentData.appointment.patient.name,
    cus_email: paymentData.appointment.patient.email,
    cus_add1: paymentData.appointment.patient.address,
    cus_phone: paymentData.appointment.patient.contactNumber,
    total_amount: paymentData.amount,
  };

  const result = await SSLService.initSSLPayment(initPaymentData);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

// validate payment
const validatePyment = async (payload: any) => {
  // In production
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "Invalid Payment!",
  //   };
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response.status !== "VALID") {
  //   return {
  //     message: "Invalid Payment!",
  //   };
  // }

  const response = payload; // In development

  await prisma.$transaction(async (transactionClient) => {
    const updatedPaymentData = await transactionClient.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: "PAID",
      },
    });

    await transactionClient.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: "PAID",
      },
    });

    return {
      message: "Payment successful",
    };
  });
};

export const paymentService = { initPayment, validatePyment };
