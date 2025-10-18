import {
  ApplyPromotionDto,
  ApplyPromotionResponse,
  CreatePromotionDto,
  Promotion,
  UpdatePromotionDto,
} from "../interface/promotion";
import { BaseApiService } from "./baseApi.service";

class PromotionService extends BaseApiService {
  async getAll(): Promise<Promotion[]> {
    try {
      const res = await this.axiosInstance.get("/promotions");
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error fetching promotions:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getOne(id: string): Promise<Promotion> {
    try {
      const res = await this.axiosInstance.get(`/promotions/${id}`);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error fetching promotion:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async create(dto: CreatePromotionDto): Promise<Promotion> {
    try {
      const res = await this.axiosInstance.post("/promotions", dto);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error creating promotion:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async update(id: string, dto: UpdatePromotionDto): Promise<Promotion> {
    try {
      const res = await this.axiosInstance.patch(`/promotions/${id}`, dto);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error updating promotion:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/promotions/${id}`);
    } catch (error: any) {
      console.error(
        "Error deleting promotion:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async apply(dto: ApplyPromotionDto): Promise<ApplyPromotionResponse> {
    try {
      const res = await this.axiosInstance.post("/promotions/apply", dto);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error applying promotion:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export const promotionService = new PromotionService();
