import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import {
  ICreateRentalOrderPayload,
  IUpdateRentalOrderStatusPayload,
} from "./rentalOrder.interface";

const buildRentalOrderInclude = {
  customer: {
    include: {
      profile: true,
    },
  },
  items: {
    include: {
      gearItem: {
        include: {
          category: true,
          provider: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  },
  payments: true,
  reviews: true,
} as const;

const getRentalOrdersByCustomer = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: buildRentalOrderInclude,
  });
};

const getRentalOrderById = async (id: string, customerId?: string) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: {
      id,
    },
    include: buildRentalOrderInclude,
  });

  if (!rentalOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental order not found");
  }

  if (customerId && rentalOrder.customerId !== customerId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You cannot access this rental order",
    );
  }

  return rentalOrder;
};

const createRentalOrder = async (
  customerId: string,
  payload: ICreateRentalOrderPayload,
) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid rental dates");
  }

  if (endDate <= startDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date",
    );
  }

  if (!payload.items?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rental items are required");
  }

  const uniqueGearItemIds = [
    ...new Set(payload.items.map((item) => item.gearItemId)),
  ];

  const gearItems = await prisma.gearItem.findMany({
    where: {
      id: {
        in: uniqueGearItemIds,
      },
    },
  });

  if (gearItems.length !== uniqueGearItemIds.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "One or more gear items not found",
    );
  }

  const quantityMap = new Map(
    payload.items.map((item) => [item.gearItemId, item.quantity]),
  );

  let totalAmount = 0;

  for (const gearItem of gearItems) {
    const quantity = quantityMap.get(gearItem.id) || 0;

    if (quantity <= 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Quantity must be greater than zero",
      );
    }

    if (!gearItem.isAvailable || gearItem.stock < quantity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for ${gearItem.name}`,
      );
    }

    totalAmount += gearItem.pricePerDay * quantity;
  }

  const rentalOrder = await prisma.rentalOrder.create({
    data: {
      customerId,
      startDate,
      endDate,
      totalAmount,
      items: {
        create: gearItems.map((gearItem) => ({
          gearItemId: gearItem.id,
          quantity: quantityMap.get(gearItem.id) || 1,
          pricePerDay: gearItem.pricePerDay,
        })),
      },
    },
    include: buildRentalOrderInclude,
  });

  return rentalOrder;
};

const getProviderRentalOrders = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      items: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: buildRentalOrderInclude,
  });
};

const getAllRentalOrdersForAdmin = async () => {
  return prisma.rentalOrder.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: buildRentalOrderInclude,
  });
};

const updateRentalOrderStatus = async (
  orderId: string,
  providerId: string,
  payload: IUpdateRentalOrderStatusPayload,
) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: {
        include: {
          gearItem: true,
        },
      },
    },
  });

  if (!rentalOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental order not found");
  }

  const ownsOrder = rentalOrder.items.some(
    (item) => item.gearItem.providerId === providerId,
  );

  if (!ownsOrder) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You cannot update this rental order",
    );
  }

  return prisma.rentalOrder.update({
    where: {
      id: orderId,
    },
    data: {
      status: payload.status,
    },
    include: buildRentalOrderInclude,
  });
};

export const rentalOrderService = {
  getRentalOrdersByCustomer,
  getRentalOrderById,
  createRentalOrder,
  getProviderRentalOrders,
  getAllRentalOrdersForAdmin,
  updateRentalOrderStatus,
};
