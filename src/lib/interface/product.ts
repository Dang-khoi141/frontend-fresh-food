import { Brand } from "./brands";
import { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  isActive?: boolean;
  brand?: Brand;
  category?: Category;
  discountPercentage?: number;
  finalPrice?: number;
  avgRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum SortBy {
  NEWEST = "newest",
  PRICE_ASC = "priceAsc",
  PRICE_DESC = "priceDesc",
  DISCOUNT = "discount",
  RATING = "rating",
}

export interface SearchProductParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: SortBy | string;
  page?: number;
  limit?: number;
}

export interface SearchProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductSelectionModalProps {
  open: boolean;
  products: Product[];
  selectedProducts: Product[];
  searchText: string;
  onSearchChange: (value: string) => void;
  onSelectionChange: (products: Product[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
}
