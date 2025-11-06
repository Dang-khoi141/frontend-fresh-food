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

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const res = await this.axiosInstance.get(
      `/products/category/${categoryId}`,
      {
        params: { categoryId },
      }
    );
    return res.data?.data ?? res.data;
  }

  async searchProducts(
    params: SearchProductParams
  ): Promise<SearchProductResponse> {
    const cleanParams: any = {};

    if (params.search) cleanParams.search = params.search;
    if (params.categoryId) cleanParams.categoryId = params.categoryId;
    if (params.brandId) cleanParams.brandId = params.brandId;
    if (params.isActive !== undefined) cleanParams.isActive = params.isActive;
    if (params.minPrice !== undefined) cleanParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined) cleanParams.maxPrice = params.maxPrice;
    if (params.minRating !== undefined)
      cleanParams.minRating = params.minRating;
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;

    const res = await this.axiosInstance.get("/products/search", {
      params: cleanParams,
    });

    return {
      data: res.data?.data ?? [],
      total: res.data?.total ?? 0,
      page: res.data?.page ?? 1,
      limit: res.data?.limit ?? params.limit ?? 20,
      totalPages: res.data?.totalPages ?? 1,
    };
  }

  async importProducts(formData: FormData): Promise<any> {
    const res = await this.axiosInstance.post("/products/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const res = await this.axiosInstance.get("/products/featured");
    return res.data?.data ?? res.data;
  }
}

export const productService = new ProductService();
