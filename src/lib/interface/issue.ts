import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface IssueDetail {
  key: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface StockIssue {
  id: string;
  warehouseId: string;
  warehouse: Warehouse;
  orderId: string;
  issueDate: string;
  issuedBy: string;
  notes?: string;
  details: IssueDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueDto {
  warehouseId: string;
  orderId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface IssueFormInfoProps {
  warehouses: Warehouse[];
  selectedWarehouse: string;
  issueDate: any;
  selectedOrder: any;
  onWarehouseChange: (value: string) => void;
  onDateChange: (date: any) => void;
  onSelectOrder: () => void;
}

export interface IssueItemsTableProps {
  items: IssueDetail[];
  onUpdateItem: (key: string, field: "quantity", value: number) => void;
  onRemoveItem: (key: string) => void;
}

export interface IssueSummaryPanelProps {
  items: IssueDetail[];
  notes: string;
  loading: boolean;
  onNotesChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}
