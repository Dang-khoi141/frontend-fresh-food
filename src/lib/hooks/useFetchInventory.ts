import { useState, useCallback } from "react";
import { InventoryItem, ImportInventoryResponse } from "../interface/inventory";
import { inventoryService } from "../service/inventory.service";

export const useFetchInventory = () => {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getAllInventory();
      setInventories(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLowStockProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getLowStockProducts();
      setLowStockProducts(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductStock = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const stock = await inventoryService.getStock(productId);
      return stock;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const importFromExcel = useCallback(
    async (file: File): Promise<ImportInventoryResponse> => {
      try {
        setLoading(true);
        setError(null);
        const response = await inventoryService.importFromExcel(file);
        await fetchAllInventory();
        return response;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllInventory]
  );

  const refetch = useCallback(async () => {
    await fetchAllInventory();
  }, [fetchAllInventory]);

  return {
    inventories,
    lowStockProducts,
    loading,
    error,
    fetchAllInventory,
    fetchLowStockProducts,
    getProductStock,
    importFromExcel,
    refetch,
  };
};
