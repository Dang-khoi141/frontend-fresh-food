import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatus,
} from "../interface/payment";
import { BaseApiService } from "./baseApi.service";

class PaymentService extends BaseApiService {
  async createPayment(
    data: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    const res = await this.axiosInstance.post("/payments", data);
    return res.data;
  }

  async checkPaymentStatus(orderCode: number): Promise<PaymentStatus> {
    const res = await this.axiosInstance.get(`/payments/status/${orderCode}`);
    return res.data?.data ?? res.data;
  }

  async cancelPayment(
    orderId: string
  ): Promise<{ message: string; orderId: string }> {
    const res = await this.axiosInstance.patch(`/payments/cancel/${orderId}`);
    return res.data;
  }

  generateVietQRUrl(
    bin: string,
    accountNumber: string,
    amount: number,
    description: string,
    accountName: string
  ): string {
    const params = new URLSearchParams({
      amount: amount.toString(),
      addInfo: description,
      accountName: accountName,
    });

    return `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.jpg?${params.toString()}`;
  }

  parsePaymentDataFromUrl(
    encodedData: string
  ): CreatePaymentResponse["data"] | null {
    try {
      return JSON.parse(decodeURIComponent(encodedData));
    } catch (error) {
      console.error("Error parsing payment data:", error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
