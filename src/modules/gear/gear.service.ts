import httpStatus from "http-status";
import { GearItemWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Meta } from "../../types";
import ApiError from "../../utils/ApiError";
import {
  ICreateGearPayload,
  IGearQuery,
  IUpdateGearPayload,
} from "./gear.interface";

const buildAvailabilityFilter = (isAvailable?: string) => {
  if (isAvailable === undefined) {
    return undefined;
  }

  if (isAvailable === "true") {
    return true;
  }

  if (isAvailable === "false") {
    return false;
  }

  return undefined;
};

const getGearItems = async (query: IGearQuery) => {
  const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
  const isAvailable = buildAvailabilityFilter(query.isAvailable);
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const where: GearItemWhereInput = {
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.brand
      ? { brand: { contains: query.brand, mode: "insensitive" } }
      : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            {
              description: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          pricePerDay: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(isAvailable !== undefined ? { isAvailable } : {}),
  };

  const [gearItems, total] = await prisma.$transaction([
    prisma.gearItem.findMany({
      where,
      skip,
      take: limit,
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
    }),
    prisma.gearItem.count({ where }),
  ]);

  const meta: Meta = {
    page,
    limit,
    total,
  };

  return {
    gearItems,
    meta,
  };
};

const getGearItemById = async (id: string) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id,
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

  if (!gearItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gear item not found");
  }

  return gearItem;
};

const createGearItem = async (
  providerId: string,
  payload: ICreateGearPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.gearItem.create({
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,
      isAvailable: payload.isAvailable,
      imageUrl: payload.imageUrl,
      categoryId: payload.categoryId,
      providerId,
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

const updateGearItem = async (
  providerId: string,
  id: string,
  payload: IUpdateGearPayload,
) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id,
    },
  });

  if (!gearItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gear item not found");
  }

  if (gearItem.providerId !== providerId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You cannot modify this gear item",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
  }

  return prisma.gearItem.update({
    where: {
      id,
    },
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,
      isAvailable: payload.isAvailable,
      imageUrl: payload.imageUrl,
      categoryId: payload.categoryId,
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

const deleteGearItem = async (providerId: string, id: string) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id,
    },
  });

  if (!gearItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Gear item not found");
  }

  if (gearItem.providerId !== providerId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You cannot delete this gear item",
    );
  }

  return prisma.gearItem.delete({
    where: {
      id,
    },
  });
};

export const gearService = {
  getGearItems,
  getGearItemById,
  createGearItem,
  updateGearItem,
  deleteGearItem,
};
