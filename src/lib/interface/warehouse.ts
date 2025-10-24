export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseDto {
  name: string;
  address: string;
}

export interface UpdateWarehouseDto {
  name?: string;
  address?: string;
}
