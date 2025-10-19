"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Order,
  UseFetchOrderOptions,
  UseFetchOrderResult,
} from "../interface/order";
import { orderService } from "../service/order.service";

export const useFetchOrder = (
  options: UseFetchOrderOptions = {}
): UseFetchOrderResult => {
  const {
    orderId,
    autoFetch = true,
    onSuccess,
    onError,
    isAdmin = false,
  } = options;

  const [order, setOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);
    try {
      const data = isAdmin
        ? await orderService.getOrderDetailAdmin(orderId)
        : await orderService.getOrderDetail(orderId);
      setOrder(data);
      onSuccess?.(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      console.error("Error fetching order detail:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId, isAdmin, onSuccess, onError]);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
      onSuccess?.(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      onSuccess?.(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      console.error("Error fetching all orders:", err);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const refetch = useCallback(async () => {
    if (orderId) {
      await fetchOrderDetail();
    } else if (isAdmin) {
      await fetchAllOrders();
    } else {
      await fetchMyOrders();
    }
  }, [orderId, isAdmin, fetchOrderDetail, fetchAllOrders, fetchMyOrders]);

  const updateStatus = useCallback(
    async (newStatus: string): Promise<Order> => {
      if (!orderId) {
        throw new Error("Order ID is required to update status");
      }

      try {
        setLoading(true);
        const updated = await orderService.updateOrderStatus(
          orderId,
          newStatus
        );
        setOrder(updated);
        return updated;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        onError?.(errorObj);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [orderId, onError]
  );

  const cancelOrder = useCallback(async (): Promise<Order> => {
    if (!orderId) {
      throw new Error("Order ID is required to cancel order");
    }

    try {
      setLoading(true);
      const cancelled = await orderService.cancelOrder(orderId);
      setOrder(cancelled);
      return cancelled;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderId, onError]);

  useEffect(() => {
    if (!autoFetch) return;

    if (orderId) {
      fetchOrderDetail();
    } else if (isAdmin) {
      fetchAllOrders();
    } else {
      fetchMyOrders();
    }
  }, [
    orderId,
    autoFetch,
    isAdmin,
    fetchOrderDetail,
    fetchAllOrders,
    fetchMyOrders,
  ]);

  return {
    order,
    orders,
    loading,
    error,
    refetch,
    updateStatus,
    cancelOrder,
    fetchAllOrders,
  };
};
