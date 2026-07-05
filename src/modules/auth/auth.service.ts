import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { jwtUtils } from "../../utils/jwt";
import { ICreateUserPayload, ILoginUserPayload } from "./auth.interface";

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

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
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
      activeStatus: user.activeStatus,
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
      activeStatus: user.activeStatus,
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

  if (user.activeStatus === "BLOCKED") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is blocked");
  }

  const newAccessToken = jwtUtils.createToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      activeStatus: user.activeStatus,
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
      activeStatus: user.activeStatus,
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
  refreshToken,
};
