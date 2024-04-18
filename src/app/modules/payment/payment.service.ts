import prisma from "../../utils/prismaClient";
import { SSLService } from "../SSL/ssl.service";

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

export const paymentService = { initPayment };
