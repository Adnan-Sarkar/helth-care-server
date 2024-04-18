import axios from "axios";
import config from "../../config";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const initSSLPayment = async (paymentData: any) => {
  const { tran_id, cus_name, cus_email, cus_add1, cus_phone, total_amount } =
    paymentData;

  try {
    const store_id = config.SSLCOMMERZ_STORE_ID;
    const store_passwd = config.SSLCOMMERZ_STORE_PASSWORD;

    const data = {
      store_id,
      store_passwd,
      total_amount,
      currency: "BDT",
      tran_id,
      success_url: config.SSLCOMMERZ_SUCCES_URL,
      fail_url: config.SSLCOMMERZ_FAIL_URL,
      cancel_url: config.SSLCOMMERZ_CANCEL_URL,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment Fee",
      product_category: "Service",
      product_profile: "general",
      cus_name,
      cus_email,
      cus_add1,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "POST",
      url: config.SSLCOMMERZ_SEASSON_API_URL,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Error");
  }
};

const validatePayment = async (payload: any) => {
  try {
    if (!payload || !payload.status || !(payload.status === "VALID")) {
      return {
        message: "Invalid Payment!",
      };
    }

    const response = await axios({
      method: "GET",
      url: `${config.SSLCOMMERZ_VALIDATION_API_URL}?val_id=${payload.val_id}$store_id=${config.SSLCOMMERZ_STORE_ID}&store_passwd=${config.SSLCOMMERZ_STORE_PASSWORD}&format=json`,
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed!");
  }
};

export const SSLService = {
  initSSLPayment,
  validatePayment,
};
