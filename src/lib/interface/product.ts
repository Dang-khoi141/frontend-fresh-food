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
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchProductParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "relevance" | "priceAsc" | "priceDesc" | "newest";
}

export interface SearchProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    brand?: { name: string };
  };
}
