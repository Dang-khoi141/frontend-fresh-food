"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  Warehouse,
} from "../interface/warehouse";
import { warehouseService } from "../service/warehouse.service";

interface UseFetchWarehouseOptions {
  warehouseId?: string;
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseFetchWarehouseResult {
  warehouse: Warehouse | null;
  warehouses: Warehouse[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createWarehouse: (dto: CreateWarehouseDto) => Promise<Warehouse>;
  updateWarehouse: (id: string, dto: UpdateWarehouseDto) => Promise<Warehouse>;
  deleteWarehouse: (id: string) => Promise<void>;
}

export const useFetchWarehouse = (
  options: UseFetchWarehouseOptions = {}
): UseFetchWarehouseResult => {
  const { warehouseId, autoFetch = true, onSuccess, onError } = options;

  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWarehouseDetail = useCallback(async () => {
    if (!warehouseId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await warehouseService.getWarehouseById(warehouseId);
      setWarehouse(data);
      onSuccess?.(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      console.error("Error fetching warehouse detail:", err);
    } finally {
      setLoading(false);
    }
  }, [warehouseId, onSuccess, onError]);

  const fetchAllWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await warehouseService.getAllWarehouses();
      setWarehouses(data);
      onSuccess?.(data);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const refetch = useCallback(async () => {
    if (warehouseId) {
      await fetchWarehouseDetail();
    } else {
      await fetchAllWarehouses();
    }
  }, [warehouseId, fetchWarehouseDetail, fetchAllWarehouses]);

  const createWarehouse = useCallback(
    async (dto: CreateWarehouseDto): Promise<Warehouse> => {
      try {
        setLoading(true);
        const created = await warehouseService.createWarehouse(dto);
        await fetchAllWarehouses();
        return created;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        onError?.(errorObj);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllWarehouses, onError]
  );

  const updateWarehouse = useCallback(
    async (id: string, dto: UpdateWarehouseDto): Promise<Warehouse> => {
      try {
        setLoading(true);
        const updated = await warehouseService.updateWarehouse(id, dto);
        await fetchAllWarehouses();
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
    [fetchAllWarehouses, onError]
  );

  const deleteWarehouse = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        await warehouseService.deleteWarehouse(id);
        await fetchAllWarehouses();
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        onError?.(errorObj);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllWarehouses, onError]
  );

  useEffect(() => {
    if (!autoFetch) return;

    if (warehouseId) {
      fetchWarehouseDetail();
    } else {
      fetchAllWarehouses();
    }
  }, [warehouseId, autoFetch, fetchWarehouseDetail, fetchAllWarehouses]);

  return {
    warehouse,
    warehouses,
    loading,
    error,
    refetch,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
};
