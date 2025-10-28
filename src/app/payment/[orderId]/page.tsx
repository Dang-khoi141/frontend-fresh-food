"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../lib/components/landing-page/footer/footer";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";
import { usePaymentFlow } from "../../../lib/hooks/usePaymentFlow";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const { orderId } = use(params);
  const { order, paymentData, status, error, handleCopy, cancelPayment } = usePaymentFlow(orderId);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelPayment = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy thanh toán này?")) {
      return;
    }

    try {
      setIsCancelling(true);
      await cancelPayment();
      router.push("/payment/cancel");
    } catch (err: any) {
      setIsCancelling(false);
      alert(err.message || "Có lỗi xảy ra khi hủy thanh toán");
    }
  };

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
              <button
                onClick={() => router.push("/cart")}
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Quay lại giỏ hàng
              </button>
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
            <button
              onClick={() => router.push("/cart")}
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </>
    );

  const paymentInfo = paymentData.payosResponse?.data;

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

        <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-red-600 font-semibold text-center text-sm md:text-base">
            ⚠️ Yêu cầu copy chính xác số tiền và nội dung chuyển khoản. Hệ thống sẽ hủy giao dịch nếu không nhận được thanh toán trong vòng 15 phút. Thanh toán xong vui lòng chờ 1 phút.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCancelPayment}
            disabled={isCancelling}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {isCancelling ? "Đang hủy..." : "Hủy thanh toán"}
          </button>
        </div>
      </section>
      <Footer />
    </>
  );
}
