"use client";

import { useState } from "react";
import { Product, SearchProductParams, SearchProductResponse } from "../interface/product";
import { productService } from "../service/product.service";

const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Product[] = await response.json();
      setProducts(data);
      setTotal(data.length);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductsByCategory(categoryId);
      setProducts(data);
      setTotal(data.length);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (params: SearchProductParams) => {
    setLoading(true);
    setError(null);
    try {
      const response: SearchProductResponse = await productService.searchProducts(params);
      setProducts(response.data);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    total,
    page,
    totalPages,
    fetchProducts,
    fetchProductsByCategory,
    searchProducts,
  };
};

export default useFetchProducts;