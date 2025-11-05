import { useEffect, useState, useCallback } from "react";
import { StockReceipt } from "../interface/receipt";
import { receiptService } from "../service/receipt.service";

export const useFetchReceipts = () => {
  const [receipts, setReceipts] = useState<StockReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await receiptService.getAllReceipts();
      setReceipts(data);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching receipts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return {
    receipts,
    loading,
    error,
    refetch: fetchReceipts,
  };
};

export const useFetchReceiptById = (id: string) => {
  const [receipt, setReceipt] = useState<StockReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReceipt = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await receiptService.getReceiptById(id);
      setReceipt(data);
    } catch (err) {
      const error = err as Error;
      console.error(`Error fetching receipt ${id}:`, error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReceipt();
  }, [fetchReceipt]);

  return {
    receipt,
    loading,
    error,
    refetch: fetchReceipt,
  };
};
