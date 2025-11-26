import { Product } from "./product";

export interface InventoryItem {
  productId: string;
  stock: number;
  lowStockThreshold: number;
  product?: Product;
  isMobile: boolean;
}

export interface ImportInventoryResponse {
  imported: number;
  message: string;
}

export interface PageHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
  isMobile: boolean;
}

export interface SearchBarProps {
  searchText: string;
  onSearch: (value: string) => void;
  onFilterClick: () => void;
  isMobile: boolean;
}
