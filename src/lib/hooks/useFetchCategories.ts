"use client";

import { useCallback, useEffect, useState } from "react";
import { Category } from "../interface/category";

export default function useFetchCategories(autoFetch: boolean = true) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(
    async (includeChildren: boolean = false) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        if (!response.ok) throw new Error("Không thể tải danh mục sản phẩm!");

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        const error = err as Error;
        console.error("❌ Lỗi tải danh mục:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  return { categories, loading, error, fetchCategories };
}
