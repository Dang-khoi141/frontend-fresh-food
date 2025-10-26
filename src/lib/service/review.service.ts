"use client";

import { axiosInstance } from "@/providers/data-provider/index";
import { IReview } from "../interface/review";

export const reviewService = {
  async create(
    productId: string,
    data: Omit<IReview, "id" | "user" | "productId">
  ) {
    const res = await axiosInstance.post(`/reviews/product/${productId}`, data);
    return res.data;
  },

  async getByProduct(productId: string) {
    const res = await axiosInstance.get(`/reviews/product/${productId}`);
    return res.data;
  },

  async update(id: string, data: Partial<IReview>) {
    const res = await axiosInstance.patch(`/reviews/${id}`, data);
    return res.data;
  },

  async remove(id: string) {
    const res = await axiosInstance.delete(`/reviews/${id}`);
    return res.data;
  },
};
