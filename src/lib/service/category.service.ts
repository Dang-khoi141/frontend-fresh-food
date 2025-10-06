import { BaseApiService } from "./baseApi.service";

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent?: Category;
  children?: Category[];
  products?: any[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

class CategoryService extends BaseApiService {
  async getTopCategories(limit = 5) {
    const res = await this.axiosInstance.get(`/categories/top?limit=${limit}`);
    return res.data?.data ?? res.data;
  }
}

export const categoryService = new CategoryService();
