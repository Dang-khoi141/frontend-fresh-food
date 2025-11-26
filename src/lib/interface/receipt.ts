import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface StockReceiptDetail {
  id: string;
  product: Product;
  quantity: number;
  unitCost: number;
}

export interface StockReceipt {
  id: string;
  warehouse: Warehouse;
  receiptDate: string | Date;
  receivedBy: string;
  totalValue: number;
  details: StockReceiptDetail[];
}

export interface CreateReceiptItemDto {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface CreateReceiptDto {
  warehouseId: string;
  items: CreateReceiptItemDto[];
}

export interface ReceiptListResponse {
  data: StockReceipt[];
  message?: string;
}

export interface ReceiptDetailResponse {
  data: StockReceipt;
  message?: string;
}

export interface CreateReceiptResponse {
  data: StockReceipt;
  message: string;
}

export interface ReceiptItem extends CreateReceiptItemDto {
  key: string;
  product?: Product;
}

export interface ReceiptFormInfoProps {
  warehouses: Warehouse[];
  selectedWarehouse: string;
  onWarehouseChange: (value: string) => void;
}

export interface ReceiptItemsTableProps {
  items: ReceiptItem[];
  onUpdateItem: (
    key: string,
    field: "quantity" | "unitCost",
    value: number
  ) => void;
  onRemoveItem: (key: string) => void;
}

export interface ReceiptSummaryPanelProps {
  items: ReceiptItem[];
  totalPayment: number;
  notes: string;
  loading: boolean;
  onNotesChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}
