"use client";

import { Order } from "@/lib/interface/order";
import {
  CreatePaymentResponse,
  PaymentFlowState,
} from "@/lib/interface/payment";
import { orderService } from "@/lib/service/order.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useFetchPayment from "./useFetchPayment";

/**
 * usePaymentFlow — hook quản lý toàn bộ vòng đời thanh toán online.
 *  - Fetch order
 *  - Create payment link nếu chưa có
 *  - Poll trạng thái PayOS mỗi 5s
 *  - Redirect sau khi thanh toán thành công
 */
export function usePaymentFlow(orderId: string | undefined): PaymentFlowState {
  const router = useRouter();
  const { createPayment, checkPaymentStatus } = useFetchPayment();
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentData, setPaymentData] = useState<
    CreatePaymentResponse["data"] | null
  >(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "pending" | "success" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(600);
  const paymentCreated = useRef(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!orderId || hasFetched.current) return;
    hasFetched.current = true;

    const fetchOrder = async () => {
      try {
        setStatus("loading");
        const orderData = await orderService.getOrderDetail(orderId);
        if (!orderData) throw new Error("Không tìm thấy đơn hàng");
        if (orderData.paymentMethod !== "ONLINE")
          throw new Error("Đơn hàng này không dùng thanh toán trực tuyến");

        setOrder(orderData);

        if (orderData.status === "PAID") {
          setStatus("success");
          return;
        }

        const cacheKey = `payment_${orderData.id}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setPaymentData(JSON.parse(cached));
          setStatus("pending");
          return;
        }

        if (!paymentCreated.current) {
          paymentCreated.current = true;
          const resp = await createPayment({
            orderId: orderData.id,
            description: `DH-${orderData.id.slice(-8)}`,
            items: orderData.items.map(i => ({
              name: i.product.name,
              price: Number(i.unitPrice),
              quantity: i.quantity,
            })),
            discountAmount: orderData.discountAmount || 0,
          });

          if (resp?.payosResponse?.data) {
            setPaymentData(resp);
            sessionStorage.setItem(cacheKey, JSON.stringify(resp));
            setStatus("pending");
          } else {
            throw new Error(
              resp?.payosResponse?.desc || "Không thể tạo thanh toán"
            );
          }
        }
      } catch (err: any) {
        console.error("Lỗi trong usePaymentFlow:", err);
        setError(err.message);
        setStatus("failed");
      }
    };

    fetchOrder();
  }, [orderId, createPayment]);

  useEffect(() => {
    if (status !== "pending") return;
    const timer = setInterval(
      () => setCountdown(c => (c > 0 ? c - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (!paymentData || !order?.id || status !== "pending") return;

    let isActive = true;
    const interval = setInterval(async () => {
      if (!isActive) return;
      try {
        const [payosResult, latestOrder] = await Promise.all([
          checkPaymentStatus(paymentData.payosResponse.data.orderCode),
          orderService.getOrderDetail(order.id),
        ]);

        const payosStatus = payosResult?.status?.toUpperCase();
        if (
          ["PAID", "SUCCESS", "COMPLETED"].includes(payosStatus || "") ||
          latestOrder.status === "PAID"
        ) {
          setStatus("success");
          sessionStorage.removeItem(`payment_${order.id}`);
          sessionStorage.setItem(`from_payment_${order.id}`, "true");
          clearInterval(interval);
          setTimeout(() => router.replace(`/orders/${order.id}`), 2000);
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra PayOS:", err);
      }
    }, 5000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [paymentData, order?.id, status, checkPaymentStatus, router]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép ${label}!`);
  };

  return { order, paymentData, status, countdown, error, handleCopy };
}
