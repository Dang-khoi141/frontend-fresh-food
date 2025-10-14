import axios from "axios";

const PROVINCE_API_BASE = "https://provinces.open-api.vn/api";

export interface Ward {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
}

export interface District {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  short_codename: string;
  province_code: number;
  wards?: Ward[];
}

export interface Province {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: number;
  districts?: District[];
}

class ProvinceApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: PROVINCE_API_BASE,
      timeout: 10000,
    });
  }
  async getAllProvinces(): Promise<Province[]> {
    try {
      const response = await this.axiosInstance.get("/p/");
      return response.data;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      return [];
    }
  }

  async getProvinceWithDistricts(
    provinceCode: number
  ): Promise<Province | null> {
    try {
      const response = await this.axiosInstance.get(`/p/${provinceCode}`, {
        params: { depth: 2 },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching province details:", error);
      return null;
    }
  }

  async getDistrictsByProvince(provinceCode: number): Promise<District[]> {
    try {
      const province = await this.getProvinceWithDistricts(provinceCode);
      return province?.districts || [];
    } catch (error) {
      console.error("Error fetching districts:", error);
      return [];
    }
  }

  async getDistrictWithWards(districtCode: number): Promise<District | null> {
    try {
      const response = await this.axiosInstance.get(`/d/${districtCode}`, {
        params: { depth: 2 },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching district details:", error);
      return null;
    }
  }

  async getWardsByDistrict(districtCode: number): Promise<Ward[]> {
    try {
      const district = await this.getDistrictWithWards(districtCode);
      return district?.wards || [];
    } catch (error) {
      console.error("Error fetching wards:", error);
      return [];
    }
  }

  async searchProvinces(query: string): Promise<Province[]> {
    try {
      const response = await this.axiosInstance.get("/p/search/", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching provinces:", error);
      return [];
    }
  }
}

export const provinceApiService = new ProvinceApiService();
