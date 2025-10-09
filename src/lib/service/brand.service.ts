import { Brand } from "../interface/brands";
import { BaseApiService } from "./baseApi.service";

class BrandService extends BaseApiService {
  async getAllBrands() {
    const res = await this.axiosInstance.get("/brands");
    return res.data?.data ?? res.data;
  }
}

export const brandService = new BrandService();
