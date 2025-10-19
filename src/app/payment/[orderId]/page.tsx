"use client";

import { use } from "react";
import Link from "next/link";
import Footer from "../../../lib/components/landing-page/footer/footer";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";
import { usePaymentFlow } from "../../../lib/hooks/usePaymentFlow";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { order, paymentData, status, countdown, error, handleCopy } = usePaymentFlow(orderId);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (status === "loading" || status === "idle")
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/orders/${orderId}`}
                className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold"
              >
                Xem đơn hàng
              </Link>
              <Link
                href="/cart"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </>
    );

  if (!order || !paymentData)
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">
              Không tìm thấy thông tin thanh toán
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>
            <Link
              href="/cart"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </>
    );

  const paymentInfo = paymentData.payosResponse?.data;

  if (status === "success")
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng của bạn đã được thanh toán. Chúng tôi sẽ xử lý và giao hàng sớm nhất.
            </p>
            <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <FreshNav />
      <section className="max-w-4xl mx-auto px-4 py-10 mt-28 mb-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Thanh toán đơn hàng</h1>
          <p className="text-lg font-semibold text-emerald-600 mb-2">
            Mã đơn hàng: {order.orderNumber}
          </p>
          <p className="text-gray-600">
            Vui lòng quét mã QR hoặc chuyển khoản theo thông tin bên dưới
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
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
                src={`https://img.vietqr.io/image/${paymentInfo.bin}-${paymentInfo.accountNumber}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${encodeURIComponent(
                  paymentInfo.description
                )}&accountName=${encodeURIComponent(paymentInfo.accountName)}`}
                alt="QR Code thanh toán"
                className="w-64 h-64 border rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Sử dụng ứng dụng ngân hàng để quét mã QR
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Thông tin chuyển khoản</h3>
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
                    onClick={() => handleCopy(paymentInfo.accountNumber, "số tài khoản")}
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
                <p className="font-semibold text-emerald-600 text-xl">
                  {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600">Nội dung chuyển khoản</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold bg-yellow-50 border border-yellow-200 rounded px-3 py-2 break-all flex-1">
                    {paymentInfo.description}
                  </p>
                  <button
                    onClick={() => handleCopy(paymentInfo.description, "nội dung")}
                    className="text-emerald-600 hover:text-emerald-700 text-sm underline whitespace-nowrap"
                  >
                    Sao chép
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/orders/${order.id}`}
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            Xem chi tiết đơn hàng
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
