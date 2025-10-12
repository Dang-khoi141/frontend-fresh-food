"use client";

import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatus,
} from "@/lib/interface/payment";
import { paymentService } from "@/lib/service/payment.service";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function useFetchPayment() {
  const [paymentData, setPaymentData] = useState<
    CreatePaymentResponse["data"] | null
  >(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const createPayment = useCallback(
    async (data: CreatePaymentRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentService.createPayment(data);

        if (response.statusCode === 201 && response.data) {
          setPaymentData(response.data);
          return response.data;
        } else {
          throw new Error(response.message || "Failed to create payment");
        }
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const checkPaymentStatus = useCallback(async (orderCode: number) => {
    try {
      setLoading(true);
      setError(null);
      const status = await paymentService.checkPaymentStatus(orderCode);
      setPaymentStatus(status);
      return status;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const parsePaymentDataFromUrl = useCallback((encodedData: string) => {
    try {
      const data = paymentService.parsePaymentDataFromUrl(encodedData);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearPaymentData = useCallback(() => {
    setPaymentData(null);
    setPaymentStatus(null);
  }, []);

  return {
    paymentData,
    paymentStatus,
    loading,
    error,
    createPayment,
    checkPaymentStatus,
    parsePaymentDataFromUrl,
    clearError,
    clearPaymentData,
  };
}
