import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import {
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "./category.interface";

const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllCategoriesForAdmin = async () => {
  return getCategories();
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const createCategory = async (payload: ICreateCategoryPayload) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existingCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  return prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
    },
  });
};

const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id,
        },
      },
    });

    if (existingCategory) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Category already exists");
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name: payload.name,
      description: payload.description,
    },
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  getCategories,
  getAllCategoriesForAdmin,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
