"use client";

import { useState, useEffect } from "react";
import { promotionService } from "../service/promotion.service";
import { Promotion } from "../interface/promotion";

export const useFetchPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promotionService.getAll();
      setPromotions(data);
      setIsFetched(true);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      setError(err as Error);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const activePromotions = promotions.filter(promo => {
    if (!promo.isActive) return false;
    const now = new Date();
    if (promo.startDate && new Date(promo.startDate) > now) return false;
    if (promo.endDate && new Date(promo.endDate) < now) return false;
    return true;
  });

  return {
    promotions,
    activePromotions,
    loading,
    error,
    isFetched,
    refetch: fetchPromotions,
  };
};

export const useFetchPromotion = (id: string) => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPromotion = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await promotionService.getOne(id);
      setPromotion(data);
    } catch (err) {
      console.error("Error fetching promotion:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotion();
  }, [id, fetchPromotion]);

  return { promotion, loading, error, refetch: fetchPromotion };
};

export const useApplyPromotion = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(
    null
  );

  const applyPromotion = async (code: string, total: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promotionService.apply({ code, total });
      setDiscount(result.discount);
      setAppliedPromotion(result.promotion);
      return result;
    } catch (err) {
      console.error("Error applying promotion:", err);
      setError(err as Error);
      setDiscount(0);
      setAppliedPromotion(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearPromotion = () => {
    setDiscount(0);
    setAppliedPromotion(null);
    setError(null);
  };

  return {
    applyPromotion,
    clearPromotion,
    discount,
    appliedPromotion,
    loading,
    error,
  };
};

export const useValidatePromotion = () => {
  const [validating, setValidating] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCode = async (code: string, total: number) => {
    if (!code || code.trim() === "") {
      setIsValid(false);
      setValidationError("Vui lòng nhập mã khuyến mãi");
      return false;
    }

    setValidating(true);
    setValidationError(null);

    try {
      await promotionService.apply({ code, total });
      setIsValid(true);
      return true;
    } catch (err: any) {
      setIsValid(false);
      const errorMsg = err.response?.data?.message || "Mã không hợp lệ";
      setValidationError(errorMsg);
      return false;
    } finally {
      setValidating(false);
    }
  };

  const resetValidation = () => {
    setIsValid(null);
    setValidationError(null);
  };

  return {
    validateCode,
    resetValidation,
    validating,
    isValid,
    validationError,
  };
};
