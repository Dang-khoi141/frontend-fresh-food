import { axiosInstance } from "../../providers/data-provider";
import {
  CreateInventoryCheckDto,
  InventoryCheck,
} from "../interface/inventory-check";

class InventoryCheckService {
  async getAll(): Promise<InventoryCheck[]> {
    const res = await axiosInstance.get("/inventory/checks");
    return res.data?.data ?? res.data;
  }

  async getById(id: string): Promise<InventoryCheck> {
    const res = await axiosInstance.get(`/inventory/checks/${id}`);
    return res.data?.data ?? res.data;
  }

  async create(dto: CreateInventoryCheckDto): Promise<InventoryCheck> {
    const res = await axiosInstance.post("/inventory/checks", dto);
    return res.data?.data ?? res.data;
  }
}

export const inventoryCheckService = new InventoryCheckService();
