import { Order, CreateOrderRequest } from "../interface/order";
import { BaseApiService } from "./baseApi.service";

class OrderService extends BaseApiService {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      const res = await this.axiosInstance.post("/orders/create", data);
      const order = res.data?.data ?? res.data;
      if (!order || !order.id) {
        throw new Error("Invalid order response: missing order ID");
      }

      return order;
    } catch (error: any) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getMyOrders(): Promise<Order[]> {
    try {
      const res = await this.axiosInstance.get("/orders/my-orders");
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getOrderDetail(orderId: string): Promise<Order> {
    try {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) {
        console.error("Invalid UUID format:", orderId);
        throw new Error("Invalid order ID format");
      }

      const res = await this.axiosInstance.get(`/orders/${orderId}`);
      const order = res.data?.data ?? res.data;
      return order;
    } catch (error: any) {
      console.error("Error fetching order detail:", {
        orderId,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const res = await this.axiosInstance.patch(`/orders/${orderId}/cancel`);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error canceling order:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const res = await this.axiosInstance.patch(
        `/orders/${orderId}/status/${status}`
      );
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export const orderService = new OrderService();
