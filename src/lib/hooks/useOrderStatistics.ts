"use client";

import axios from "axios";
import { useState } from "react";
import { OrderStatistics } from "../interface/orderStatistics";

const useOrderStatistics = () => {
  const [stats, setStats] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = async (period: "day" | "week" | "month" = "week") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/statistics`,
        { params: { period } }
      );

      setStats(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching order statistics:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, fetchStatistics };
};

export default useOrderStatistics;
