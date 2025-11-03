export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  totalProducts?: number;
  createdAt: Date;
  updatedAt: Date;
}
