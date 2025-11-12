"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelPayment = async () => {
    setShowCancelModal(false);

    try {
      setIsCancelling(true);
      await cancelPayment();
      toast.success("Đã hủy thanh toán thành công");
      router.push("/payment/cancel");
    } catch (err: any) {
      setIsCancelling(false);
      toast.error(err.message || "Có lỗi xảy ra khi hủy thanh toán");
    }
  };

  const handleCopyWithToast = (text: string, label: string) => {
    handleCopy(text, label);
    toast.success(`Đã sao chép ${label}`);
  };

  if (status === "loading" || status === "idle")
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center mt-16 sm:mt-28">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center mt-16 sm:mt-28">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8">
            <div className="text-red-600 text-4xl sm:text-5xl mb-3 sm:mb-4">⚠️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-3 sm:mb-4">Có lỗi xảy ra</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{error}</p>
            <div className="flex gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push("/cart")}
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
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
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center mt-16 sm:mt-28">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-700 mb-3 sm:mb-4">
              Không tìm thấy thông tin thanh toán
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>
            <button
              onClick={() => router.push("/cart")}
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
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
      <section className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 mt-16 sm:mt-28 mb-6 sm:mb-10">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Thanh toán đơn hàng</h1>
          <p className="text-base sm:text-lg font-semibold text-emerald-600 mb-2">
            Mã đơn hàng: {order.orderNumber}
          </p>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Vui lòng quét mã QR hoặc chuyển khoản theo thông tin bên dưới
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-center">
              Quét mã QR để thanh toán
            </h3>
            <div className="flex justify-center mb-3 sm:mb-4">
              <img
                src={`https://img.vietqr.io/image/${paymentInfo.bin}-${paymentInfo.accountNumber}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${encodeURIComponent(
                  paymentInfo.description
                )}&accountName=${encodeURIComponent(paymentInfo.accountName)}`}
                alt="QR Code thanh toán"
                className="w-56 h-56 sm:w-64 sm:h-64 border rounded-lg"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
              Sử dụng ứng dụng ngân hàng để quét mã QR
            </p>
          </div>

          <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Thông tin chuyển khoản</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm text-gray-600">Ngân hàng</label>
                <p className="font-semibold text-sm sm:text-base">{paymentInfo.bin} - MB Bank</p>
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-600">Số tài khoản</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm sm:text-base flex-1">{paymentInfo.accountNumber}</p>
                  <button
                    onClick={() => handleCopyWithToast(paymentInfo.accountNumber, "số tài khoản")}
                    className="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm underline whitespace-nowrap"
                  >
                    Sao chép
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-600">Tên tài khoản</label>
                <p className="font-semibold text-sm sm:text-base break-words">{paymentInfo.accountName}</p>
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-600">Số tiền</label>
                <p className="font-semibold text-emerald-600 text-lg sm:text-xl">
                  {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
                </p>
              </div>

              <div>
                <label className="text-xs sm:text-sm text-gray-600">Nội dung chuyển khoản</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <p className="font-semibold bg-yellow-50 border border-yellow-200 rounded px-2 sm:px-3 py-1.5 sm:py-2 break-all flex-1 text-xs sm:text-sm w-full">
                    {paymentInfo.description}
                  </p>
                  <button
                    onClick={() => handleCopyWithToast(paymentInfo.description, "nội dung")}
                    className="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm underline whitespace-nowrap self-start sm:self-auto"
                  >
                    Sao chép
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4">
          <p className="text-red-600 font-semibold text-center text-xs sm:text-sm md:text-base leading-relaxed">
            ⚠️ Yêu cầu copy chính xác số tiền và nội dung chuyển khoản. Hệ thống sẽ hủy giao dịch nếu không nhận được thanh toán trong vòng 15 phút. Thanh toán xong vui lòng chờ 1 phút.
          </p>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center px-2">
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={isCancelling}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            {isCancelling ? "Đang hủy..." : "Hủy thanh toán"}
          </button>
        </div>
      </section>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              Xác nhận hủy thanh toán
            </h3>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn hủy thanh toán này? Đơn hàng sẽ không được xử lý.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
              >
                Không, quay lại
              </button>
              <button
                onClick={handleCancelPayment}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
              >
                Có, hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
