import { UserStatus } from "../../../prisma/generated/prisma/enums";

export interface IUpdateUserStatusPayload {
  status: UserStatus;
}
