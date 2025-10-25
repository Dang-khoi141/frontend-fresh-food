export interface InventoryCheckDetail {
  id?: string;
  productId: string;
  productName?: string;
  systemQuantity: number;
  actualQuantity: number;
  variance: number;
}

export interface InventoryCheck {
  id: string;
  warehouseId: string;
  warehouseName?: string;
  checkDate: string;
  checkedBy: string;
  details: InventoryCheckDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCheckItemDto {
  productId: string;
  systemQuantity: number;
  actualQuantity: number;
}

export interface CreateInventoryCheckDto {
  warehouseId: string;
  items: CreateCheckItemDto[];
}

export interface CheckItem {
  key: string;
  productId?: string;
  productName?: string;
  systemQuantity: number;
  actualQuantity: number;
}
