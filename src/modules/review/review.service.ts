import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { ICreateReviewPayload } from "./review.interface";

const createReview = async (
  customerId: string,
  payload: ICreateReviewPayload,
) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: {
      id: payload.rentalOrderId,
    },
    include: {
      items: true,
      reviews: true,
    },
  });

  if (!rentalOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental order not found");
  }

  if (rentalOrder.customerId !== customerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot review this order");
  }

  if (rentalOrder.status !== "RETURNED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only review after the order is returned",
    );
  }

  if (rentalOrder.reviews) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Review already exists for this order",
    );
  }

  const isGearItemInOrder = rentalOrder.items.some(
    (item) => item.gearItemId === payload.gearItemId,
  );

  if (!isGearItemInOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Selected gear item is not part of this rental order",
    );
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  return prisma.review.create({
    data: {
      customerId,
      gearItemId: payload.gearItemId,
      rentalOrderId: payload.rentalOrderId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: {
        include: {
          profile: true,
        },
      },
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
      rentalOrder: true,
    },
  });
};

export const reviewService = {
  createReview,
};
