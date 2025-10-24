import { Product } from "./product";

export interface InventoryItem {
  productId: string;
  stock: number;
  lowStockThreshold: number;
  product?: Product;
}

export interface ImportInventoryResponse {
  imported: number;
  message: string;
}

export interface PageHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
}

export interface SearchBarProps {
  searchText: string;
  onSearch: (value: string) => void;
  onFilterClick: () => void;
}
