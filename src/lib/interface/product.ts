import { Brand } from "./brands";
import { Category } from "./category";

export interface Product {
  id: string | number;
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
