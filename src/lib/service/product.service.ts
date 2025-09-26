import { Product } from "../interface/product";
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
}

export const productService = new ProductService();
