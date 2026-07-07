import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Prisma } from "../../../prisma/generated/prisma/client";
import { Role } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { jwtUtils } from "../../utils/jwt";
import {
  ICreateUserPayload,
  ILoginUserPayload,
  IUpdateProfilePayload,
} from "./auth.interface";

const createUser = async (createUserPayload: ICreateUserPayload) => {
  const { name, email, password } = createUserPayload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  if (createUserPayload.role.toLowerCase() === Role.ADMIN.toLowerCase()) {
    throw new ApiError(400, "Cannot create user with ADMIN role");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const role = Role[createUserPayload.role.toUpperCase() as keyof typeof Role];

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {},
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const loginUser = async (loginUserPayload: ILoginUserPayload) => {
  const { email, password } = loginUserPayload;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const accessToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      activeStatus: user.status,
      roles: user.role,
    },
    config.jwt_access_token_secret,
    config.jwt_access_token_expires_in,
  );

  const refreshToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      activeStatus: user.status,
      roles: user.role,
    },
    config.jwt_refresh_token_secret,
    config.jwt_refresh_token_expires_in,
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateProfile = async (
  userId: string,
  updateData: IUpdateProfilePayload,
) => {
  const userData: Prisma.UserUpdateInput = {};

  if (updateData.name) {
    userData.name = updateData.name;
  }

  if (updateData.email) {
    userData.email = updateData.email;
  }

  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(
      updateData.password,
      config.bcrypt_salt_rounds,
    );
    userData.password = hashedPassword;
  }

  const profileData: Prisma.ProfileUpdateInput = {};

  if (updateData.phone) {
    profileData.phone = updateData.phone;
  }

  if (updateData.address) {
    profileData.address = updateData.address;
  }

  if (updateData.avatarUrl) {
    profileData.avatarUrl = updateData.avatarUrl;
  }

  if (updateData.bio) {
    profileData.bio = updateData.bio;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...userData,
      profile:
        Object.keys(profileData).length > 0
          ? { update: profileData }
          : undefined,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return updatedUser;
};

const refreshToken = async (refreshToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_token_secret,
  );

  const userId = verifiedToken.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }

  if (user.status === "SUSPENDED") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is suspended");
  }

  const newAccessToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      activeStatus: user.status,
      roles: user.role,
    },
    config.jwt_access_token_secret,
    config.jwt_access_token_expires_in,
  );

  const newRefreshToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      activeStatus: user.status,
      roles: user.role,
    },
    config.jwt_refresh_token_secret,
    config.jwt_refresh_token_expires_in,
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const authService = {
  createUser,
  loginUser,
  getProfile,
  updateProfile,
  refreshToken,
};
