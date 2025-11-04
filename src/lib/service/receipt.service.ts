import {
  CreateReceiptDto,
  CreateReceiptResponse,
  ReceiptDetailResponse,
  ReceiptListResponse,
  StockReceipt,
} from "../interface/receipt";
import { BaseApiService } from "./baseApi.service";

class ReceiptService extends BaseApiService {
  async createReceipt(dto: CreateReceiptDto): Promise<StockReceipt> {
    try {
      const res = await this.post<CreateReceiptResponse>(
        "/inventory/receipts",
        dto
      );
      return res.data;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error("Error creating receipt:", error);
      throw error;
    }
  }
  async getAllReceipts(): Promise<StockReceipt[]> {
    try {
      const res = await this.get<ReceiptListResponse>("/inventory/receipts");
      return Array.isArray(res) ? res : res.data;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error("Error fetching all receipts:", error);
      throw error;
    }
  }
  async getReceiptById(id: string): Promise<StockReceipt> {
    try {
      const res = await this.get<ReceiptDetailResponse>(
        `/inventory/receipts/${id}`
      );
      return (res.data ?? res) as StockReceipt;
    } catch (error) {
      if (this.isSilentError(error)) {
        throw error;
      }
      console.error(`Error fetching receipt ${id}:`, error);
      throw error;
    }
  }
  calculateTotalValue(items: { quantity: number; unitCost: number }[]): number {
    return items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  }
  formatCurrency(value: number, currency: string = "VND"): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(value);
  }
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export const receiptService = new ReceiptService();
