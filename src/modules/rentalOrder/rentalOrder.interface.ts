import { RentalStatus } from "../../../prisma/generated/prisma/enums";

export interface IRentalOrderItemPayload {
  gearItemId: string;
  quantity: number;
}

export interface ICreateRentalOrderPayload {
  startDate: string;
  endDate: string;
  items: IRentalOrderItemPayload[];
}

export interface IUpdateRentalOrderStatusPayload {
  status: RentalStatus;
}
