"use client";

import { useRouter } from "next/navigation";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";
import Footer from "../../../lib/components/landing-page/footer/footer";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <>
      <FreshNav />
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 mt-16 sm:mt-28">
        <div className="bg-white border-2 border-orange-500 rounded-lg p-6 sm:p-8 text-center shadow-lg">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600"
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

          <h1 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-3 sm:mb-4 px-2">
            Thanh toán đã bị hủy
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
            Giao dịch của bạn đã bị hủy. Đơn hàng sẽ không được xử lý.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-orange-800 leading-relaxed">
              Nếu bạn gặp vấn đề khi thanh toán, vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center px-2">
            <button
              onClick={() => router.push("/cart")}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
            >
              Quay lại giỏ hàng
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
