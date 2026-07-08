import httpStatus from "http-status";
import { UserStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { IUpdateUserStatusPayload } from "./admin.interface";

const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
};

const updateUserStatus = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!Object.values(UserStatus).includes(payload.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user status");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload.status,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
};

const getAllGearItems = async () => {
  return prisma.gearItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      provider: {
        include: {
          profile: true,
        },
      },
    },
  });
};

const getAllRentalOrders = async () => {
  return prisma.rentalOrder.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
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
    },
  });
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllGearItems,
  getAllRentalOrders,
};
