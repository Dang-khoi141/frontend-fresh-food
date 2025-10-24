import {
  Warehouse,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from "../interface/warehouse";
import { BaseApiService } from "./baseApi.service";

class WarehouseService extends BaseApiService {
  async getAllWarehouses(): Promise<Warehouse[]> {
    const res = await this.axiosInstance.get("/warehouses");
    return res.data?.data ?? res.data;
  }

  async getWarehouseById(id: string): Promise<Warehouse> {
    const res = await this.axiosInstance.get(`/warehouses/${id}`);
    return res.data?.data ?? res.data;
  }

  async createWarehouse(dto: CreateWarehouseDto): Promise<Warehouse> {
    const res = await this.axiosInstance.post("/warehouses", dto);
    return res.data?.data ?? res.data;
  }

  async updateWarehouse(
    id: string,
    dto: UpdateWarehouseDto
  ): Promise<Warehouse> {
    const res = await this.axiosInstance.patch(`/warehouses/${id}`, dto);
    return res.data?.data ?? res.data;
  }

  async deleteWarehouse(id: string): Promise<void> {
    await this.axiosInstance.delete(`/warehouses/${id}`);
  }
}

export const warehouseService = new WarehouseService();
