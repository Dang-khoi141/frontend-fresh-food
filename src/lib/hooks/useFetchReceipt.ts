import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StockReceipt } from "../interface/receipt";
import { receiptService } from "../service/receipt.service";

export const useFetchReceipts = () => {
  const [receipts, setReceipts] = useState<StockReceipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await receiptService.getAllReceipts();
      setReceipts(data);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching receipts:", error);
      setError(error);
      toast.error("Không thể tải danh sách phiếu nhập hàng");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchReceipt = async () => {
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
      toast.error("Không thể tải thông tin phiếu nhập hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  return {
    receipt,
    loading,
    error,
    refetch: fetchReceipt,
  };
};
