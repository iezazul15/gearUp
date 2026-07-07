import { Role } from "../../../prisma/generated/prisma/enums";

export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  bio?: string;
}
