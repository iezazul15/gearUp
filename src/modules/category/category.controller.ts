import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { categoryService } from "./category.service";

const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Categories fetched successfully", categories));
});

const getAllCategoriesForAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategoriesForAdmin();

    return res
      .status(httpStatus.OK)
      .json(new ApiResponse(true, "Categories fetched successfully", categories));
  },
);

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(
    req.params.id as string,
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Category fetched successfully", category));
});

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(true, "Category created successfully", category));
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(
    req.params.id as string,
    req.body,
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Category updated successfully", category));
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id as string);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(true, "Category deleted successfully", null));
});

export const categoryController = {
  getCategories,
  getAllCategoriesForAdmin,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
