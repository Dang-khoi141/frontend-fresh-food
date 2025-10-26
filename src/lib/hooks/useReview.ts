"use client";

import { useCallback, useState } from "react";
import { IReview } from "../interface/review";
import { reviewService } from "../service/review.service";

export function useReview(productId: string) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getByProduct(productId);
      setReviews(res.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const createReview = useCallback(
    async (data: Omit<IReview, "id" | "user" | "productId">) => {
      try {
        await reviewService.create(productId, data);
        await fetchReviews();
      } catch (error) {
        console.error("❌ Failed to create review:", error);
        throw error;
      }
    },
    [productId, fetchReviews]
  );

  return { reviews, loading, fetchReviews, createReview };
}
