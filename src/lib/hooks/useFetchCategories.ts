"use client";

import { useState } from "react";

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
  products?: any[];
}

const useFetchCategories = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async (includeChildren: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/categories?includeChildren=${includeChildren}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, fetchCategories };
};

export default useFetchCategories;
