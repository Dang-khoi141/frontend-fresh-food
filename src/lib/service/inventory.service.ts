import { ImportInventoryResponse, InventoryItem } from "../interface/inventory";
import { BaseApiService } from "./baseApi.service";

class InventoryService extends BaseApiService {
  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      const res = await this.get<any>("/inventory");
      return Array.isArray(res) ? res : res.data;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error("Error fetching all inventory:", error);
      throw error;
    }
  }

  async getLowStockProducts(): Promise<InventoryItem[]> {
    try {
      const res = await this.get<any>("/inventory/low-stock");
      return Array.isArray(res) ? res : res.data;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error("Error fetching low stock products:", error);
      throw error;
    }
  }

  async getStock(productId: string): Promise<number> {
    try {
      const res = await this.get<any>(`/inventory/${productId}`);
      return typeof res === "number" ? res : res.data;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error(`Error fetching stock for product ${productId}:`, error);
      throw error;
    }
  }

  async importFromExcel(file: File): Promise<ImportInventoryResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await this.post<any>("/inventory/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data ?? res;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error("Error importing inventory from Excel:", error);
      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
