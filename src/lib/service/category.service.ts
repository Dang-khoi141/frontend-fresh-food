import { Category } from "../interface/category";
import { BaseApiService } from "./baseApi.service";

class CategoryService extends BaseApiService {
  async getTopCategories(limit = 5): Promise<Category[]> {
    const res = await this.axiosInstance.get(`/categories/top?limit=${limit}`);
    return res.data?.data ?? res.data;
  }

  async getAllCategories(): Promise<Category[]> {
    const res = await this.axiosInstance.get("/categories");
    return res.data?.data ?? res.data;
  }

  async getCategoryById(id: string) {
    const res = await this.axiosInstance.get(`/categories/${id}`);
    return res.data?.data ?? res.data;
  }
}

export const categoryService = new CategoryService();
