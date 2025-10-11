"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useFetchPayment from "../../lib/hooks/useFetchPayment";
import FreshNav from "../../lib/components/landing-page/header/header-nav";
import Footer from "../../lib/components/landing-page/footer/footer";
import { useCart } from "../../contexts/cart-context";

interface PaymentData {
  message: string;
  totalAmount: number;
  payosResponse: {
    code: string;
    desc: string;
    data: {
      bin: string;
      accountNumber: string;
      accountName: string;
      amount: number;
      description: string;
      orderCode: number;
      currency: string;
      paymentLinkId: string;
      status: string;
      checkoutUrl: string;
      qrCode: string;
    };
    signature: string;
  };
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { parsePaymentDataFromUrl, checkPaymentStatus, paymentData: hookPaymentData } = useFetchPayment();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [countdown, setCountdown] = useState(600);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "checking" | "success" | "failed">("pending");
  const { clearCart } = useCart();

  useEffect(() => {
    const data = new URLSearchParams(window.location.search).get("data");
    if (!data) {
      router.push("/cart");
      return;
    }

    const parsed = parsePaymentDataFromUrl(data);
    if (parsed) {
      setPaymentData(parsed);
    } else {
      router.push("/cart");
    }
  }, [router, parsePaymentDataFromUrl]);


  useEffect(() => {
    if (paymentStatus !== "pending") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);


  useEffect(() => {
    if (!paymentData || paymentStatus !== "pending") return;

    const checkInterval = setInterval(async () => {
      try {
        const result = await checkPaymentStatus(paymentData.payosResponse.data.orderCode);
        if (result && result.status === 'PAID') {
          setPaymentStatus('success');
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [paymentData, paymentStatus, checkPaymentStatus]);


  useEffect(() => {
    if (paymentStatus === "success") {
      clearCart();
    }
  }, [paymentStatus, clearCart]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyAccountNumber = () => {
    if (paymentData) {
      navigator.clipboard.writeText(paymentData.payosResponse.data.accountNumber);
      alert("Đã sao chép số tài khoản!");
    }
  };

  const handleCopyAmount = () => {
    if (paymentData) {
      navigator.clipboard.writeText(paymentData.payosResponse.data.amount.toString());
      alert("Đã sao chép số tiền!");
    }
  };

  const handleCopyDescription = () => {
    if (paymentData) {
      navigator.clipboard.writeText(paymentData.payosResponse.data.description);
      alert("Đã sao chép nội dung!");
    }
  };

  if (!paymentData) {
    return (
      <>
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <p>Đang tải thông tin thanh toán...</p>
        </div>
        <Footer />
      </>
    );
  }

  const { payosResponse } = paymentData;
  const { data: paymentInfo } = payosResponse;

  if (paymentStatus === "success") {
    return (
      <>
        <FreshNav />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center mt-28">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
            <button
              onClick={() => router.push("/orders")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }


  return (
    <>
      <FreshNav />
      <section className="max-w-4xl mx-auto px-4 py-10 mt-28 mb-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Thanh toán đơn hàng</h1>
          <p className="text-gray-600">Vui lòng quét mã QR hoặc chuyển khoản theo thông tin bên dưới</p>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-orange-700">
              Thời gian còn lại: {formatTime(countdown)}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-center">
              Quét mã QR để thanh toán
            </h3>
            <div className="flex justify-center mb-4">
              <img
                src={`https://img.vietqr.io/image/${paymentInfo.bin}-${paymentInfo.accountNumber}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${encodeURIComponent(paymentInfo.description)}&accountName=${encodeURIComponent(paymentInfo.accountName)}`}
                alt="QR Code thanh toán"
                className="w-64 h-64 border rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Sử dụng ứng dụng ngân hàng để quét mã QR
            </p>
            <p className="text-xs text-gray-400 text-center mt-2">
              Ngân hàng: {paymentInfo.bin === "970422" ? "MB Bank" : paymentInfo.bin}
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-4">
              Thông tin chuyển khoản
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Ngân hàng</label>
                <p className="font-semibold">{paymentInfo.bin} - MB Bank</p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Số tài khoản</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold flex-1">{paymentInfo.accountNumber}</p>
                  <button
                    onClick={handleCopyAccountNumber}
                    className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                  >
                    Sao chép
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Tên tài khoản</label>
                <p className="font-semibold">{paymentInfo.accountName}</p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Số tiền</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-emerald-600 text-xl flex-1">
                    {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
                  </p>
                  <button
                    onClick={handleCopyAmount}
                    className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                  >
                    Sao chép
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Nội dung chuyển khoản</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold flex-1 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                    {paymentInfo.description}
                  </p>
                  <button
                    onClick={handleCopyDescription}
                    className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                  >
                    Sao chép
                  </button>
                </div>
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ Vui lòng nhập chính xác nội dung để được xác nhận tự động
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Mã đơn hàng</label>
                <p className="font-semibold">{paymentInfo.orderCode}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <button
                onClick={() => setPaymentStatus("checking")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
              >
                Tôi đã thanh toán
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium"
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn thanh toán</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Mở ứng dụng ngân hàng và quét mã QR hoặc chuyển khoản theo thông tin trên</li>
            <li>Đảm bảo nhập chính xác nội dung chuyển khoản</li>
            <li>Kiểm tra lại số tiền và thông tin trước khi xác nhận</li>
            <li>Sau khi chuyển khoản thành công, đơn hàng sẽ được xác nhận tự động</li>
          </ol>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <>
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <p>Đang tải...</p>
        </div>
        <Footer />
      </>
    }>
      <PaymentContent />
    </Suspense>
  );
}
