"use client";

import { useCallback, useState } from "react";
import {
  CreateInventoryCheckDto,
  InventoryCheck,
} from "../interface/inventory-check";
import { inventoryCheckService } from "../service/inventory-check.service";

export const useFetchInventoryCheck = () => {
  const [checks, setChecks] = useState<InventoryCheck[]>([]);
  const [currentCheck, setCurrentCheck] = useState<InventoryCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryCheckService.getAll();
      setChecks(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = await inventoryCheckService.getById(id);
      setCurrentCheck(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (dto: CreateInventoryCheckDto) => {
      try {
        setLoading(true);
        const newCheck = await inventoryCheckService.create(dto);
        await fetchAll();
        return newCheck;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll]
  );

  return {
    checks,
    currentCheck,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
  };
};
