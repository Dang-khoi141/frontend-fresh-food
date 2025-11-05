import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StockIssue } from "../interface/issue";
import { issueService } from "../service/issue.service";

export const useFetchIssues = () => {
  const [issues, setIssues] = useState<StockIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await issueService.getAllIssues();
      setIssues(data);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching issues:", error);
      setError(error);
      toast.error("Không thể tải danh sách phiếu xuất kho");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    issues,
    loading,
    error,
    refetch: fetchIssues,
  };
};
