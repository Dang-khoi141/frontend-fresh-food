import { Banner } from "../interface/banner";
import { BaseApiService } from "./baseApi.service";

class BannerService extends BaseApiService {
  async getAll(): Promise<Banner[]> {
    const res = await this.axiosInstance.get("/banners");
    return res.data?.data ?? res.data;
  }

  async getHeroSlider(): Promise<Banner[]> {
    const res = await this.axiosInstance.get("/banners/hero-slider");
    return res.data?.data ?? res.data;
  }

  async trackView(id: string) {
    return this.axiosInstance.post(`/banners/${id}/view`);
  }

  async trackClick(id: string) {
    return this.axiosInstance.post(`/banners/${id}/click`);
  }
}

export const bannerService = new BannerService();
