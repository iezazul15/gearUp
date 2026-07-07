export interface ICreateGearPayload {
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  stock?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  categoryId: string;
}

export interface IUpdateGearPayload {
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  stock?: number;
  isAvailable?: boolean;
  imageUrl?: string;
  categoryId?: string;
}

export interface IGearQuery {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
  page?: string;
  limit?: string;
}
