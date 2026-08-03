import axios from "axios";
import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { SSLCommerzPayment } from "./payment.interface";

const createPaymentIntent = async (userId: string, rentalOrderId: string) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      items: {
        include: {
          gearItem: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!rentalOrder)
    throw new ApiError(httpStatus.NOT_FOUND, "Rental order not found");

  if (rentalOrder.customerId !== userId)
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot pay for this order");

  if (rentalOrder.status !== "PLACED")
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This order cannot be paid for at this time",
    );

  const total_amount = rentalOrder.items.reduce(
    (sum, item) => sum + item.gearItem.pricePerDay.toNumber() * item.quantity,
    0,
  );

  const trnx_id = `REF-${rentalOrder.id}-${Date.now()}`;

  const data: SSLCommerzPayment = {
    store_id: `${config.store_id}`,
    store_passwd: `${config.store_password}`,
    product_name: `${rentalOrder.items.map((item) => item.gearItem.name).join(", ")}`,
    product_category: `${rentalOrder.items.map((item) => item.gearItem.category).join(", ")}`,
    product_profile: "physical-goods",
    total_amount: total_amount,
    currency: "BDT",
    tran_id: `${trnx_id}`,
    success_url: `${config.app_url}/api/payments/callback?tran_id=${trnx_id}&order_id=${rentalOrder.id}&status=success`,
    fail_url: `${config.app_url}/api/payments/callback?tran_id=${trnx_id}&order_id=${rentalOrder.id}&status=fail`,
    cancel_url: `${config.app_url}/api/payments/callback?tran_id=${trnx_id}&order_id=${rentalOrder.id}&status=cancel`,
    cus_name: `${rentalOrder.customer.name}`,
    cus_email: `${rentalOrder.customer.email}`,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    shipping_method: "YES",
    ship_name: `${rentalOrder.customer.name}`,
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_area: "Dhaka",
    ship_sub_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  const { data: paymentInitResponse } = await axios.post(
    `${config.sslcommerz_base_url}/gwprocess/v4/api.php`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return {
    status: paymentInitResponse.status,
    failedreason: paymentInitResponse.failedreason,
    sessionkey: paymentInitResponse.sessionkey,
    GatewayPageURL: paymentInitResponse.GatewayPageURL,
  };
};

const handleVerification = async (
  tran_id: string,
  order_id: string,
  status: string,
  payload: Record<string, any>,
) => {
  const { data } = await axios.get(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.store_id}&store_passwd=${config.store_password}&format=json`,
  );
  switch (data.status) {
    case "VALID": {
      const rentalOrder = await prisma.rentalOrder.findUnique({
        where: { id: order_id },
      });

      if (!rentalOrder)
        throw new ApiError(httpStatus.NOT_FOUND, "Rental order not found");

      if (rentalOrder.status !== "PLACED")
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "This order cannot be paid for at this time",
        );

      if (rentalOrder.totalAmount.toNumber().toFixed(2) !== payload.amount)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Payment amount does not match the order amount",
        );

      await prisma.$transaction(async (tx) => {
        await tx.rentalOrder.update({
          where: { id: order_id },
          data: {
            status: "PAID",
          },
        });

        await tx.payment.create({
          data: {
            rentalOrderId: order_id,
            transactionId: tran_id,
            amount: payload.amount,
            status: "COMPLETED",
            paidAt: new Date(payload.tran_date),
          },
        });
      });

      return { code: httpStatus.OK, message: "Payment successful" };
    }
    case "VALIDATED":
      return { code: httpStatus.OK, message: "Payment already validated" };

    case "INVALID_TRANSACTION":
      await prisma.payment.create({
        data: {
          rentalOrderId: order_id,
          transactionId: tran_id,
          amount: payload.amount,
          status: "FAILED",
          paidAt: new Date(payload.tran_date),
        },
      });

      return { code: httpStatus.BAD_REQUEST, message: "Invalid transaction" };

    default:
      throw new ApiError(httpStatus.BAD_REQUEST, "Payment verification failed");
  }
};

const getPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      rentalOrder: {
        select: {
          id: true,
          customerId: true,
          status: true,
          startDate: true,
          endDate: true,
          totalAmount: true,
        },
      },
    },
  });
};

const getPaymentById = async (userId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      rentalOrder: {
        select: {
          id: true,
          customerId: true,
          status: true,
          startDate: true,
          endDate: true,
          totalAmount: true,
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.rentalOrder.customerId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot access this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntent,
  handleVerification,
  getPayments,
  getPaymentById,
};
