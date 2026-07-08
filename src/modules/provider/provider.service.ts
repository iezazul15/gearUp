import { ICreateGearPayload, IUpdateGearPayload } from "../gear/gear.interface";
import { gearService } from "../gear/gear.service";
import { IUpdateRentalOrderStatusPayload } from "../rentalOrder/rentalOrder.interface";
import { rentalOrderService } from "../rentalOrder/rentalOrder.service";

const createGearItem = async (
  providerId: string,
  payload: ICreateGearPayload,
) => {
  return gearService.createGearItem(providerId, payload);
};

const updateGearItem = async (
  providerId: string,
  gearItemId: string,
  payload: IUpdateGearPayload,
) => {
  return gearService.updateGearItem(providerId, gearItemId, payload);
};

const deleteGearItem = async (providerId: string, gearItemId: string) => {
  return gearService.deleteGearItem(providerId, gearItemId);
};

const getProviderOrders = async (providerId: string) => {
  return rentalOrderService.getProviderRentalOrders(providerId);
};

const updateOrderStatus = async (
  orderId: string,
  providerId: string,
  payload: IUpdateRentalOrderStatusPayload,
) => {
  return rentalOrderService.updateRentalOrderStatus(
    orderId,
    providerId,
    payload,
  );
};

export const providerService = {
  createGearItem,
  updateGearItem,
  deleteGearItem,
  getProviderOrders,
  updateOrderStatus,
};
