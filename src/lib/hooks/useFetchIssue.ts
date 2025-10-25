import { useEffect, useState } from "react";
import { StockIssue } from "../interface/issue";
import { issueService } from "../service/issue.service";
import toast from "react-hot-toast";

export const useFetchIssues = () => {
  const [issues, setIssues] = useState<StockIssue[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await issueService.getAllIssues();
      setIssues(data);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Không thể tải danh sách phiếu xuất kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return {
    issues,
    loading,
    refetch: fetchIssues,
  };
};
