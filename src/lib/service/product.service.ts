import {
  Product,
  SearchProductParams,
  SearchProductResponse,
} from "../interface/product";
import { BaseApiService } from "./baseApi.service";

class ProductService extends BaseApiService {
  async getProducts(): Promise<Product[]> {
    const res = await this.axiosInstance.get("/products");
    return Array.isArray(res.data) ? res.data : res.data.data;
  }

  async getProduct(id: string): Promise<Product> {
    const res = await this.axiosInstance.get(`/products/${id}`);
    return res.data?.data ?? res.data;
  }

  async searchProducts(
    params: SearchProductParams
  ): Promise<SearchProductResponse> {
    const res = await this.axiosInstance.get("/products/search", { params });

    return {
      data: res.data?.data ?? [],
      total: res.data?.total ?? 0,
      page: res.data?.page ?? 1,
      limit: res.data?.limit ?? params.limit ?? 20,
      totalPages: res.data?.totalPages ?? 1,
    };
  }
}

export const productService = new ProductService();
