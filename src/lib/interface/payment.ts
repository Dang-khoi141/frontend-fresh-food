import { Order } from "./order";

export interface PaymentItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CreatePaymentRequest {
  orderId: string;
  description: string;
  items: PaymentItem[];
}

export interface PayosData {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface PayosResponse {
  code: string;
  desc: string;
  data: PayosData;
  signature: string;
}

export interface PaymentResponseData {
  message: string;
  totalAmount: number;
  payosResponse: PayosResponse;
}

export interface CreatePaymentResponse {
  statusCode: number;
  message: string;
  data: PaymentResponseData;
}

export interface PaymentStatus {
  orderId: string;
  status: "PENDING" | "PAID" | "CANCELED" | "FAILED";
  amount: number;
  orderCode: number;
}

export interface PaymentFlowState {
  order: Order | null;
  paymentData: CreatePaymentResponse["data"] | null;
  status: "idle" | "loading" | "pending" | "success" | "failed";
  countdown: number;
  error: string | null;
  handleCopy: (text: string, label: string) => void;
}
