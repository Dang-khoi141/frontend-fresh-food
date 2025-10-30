"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../../lib/components/landing-page/footer/footer";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            router.push("/profile-page?tab=orders");
        }
    }, [countdown, router]);

    const orderCode = searchParams.get("orderCode");
    const amount = searchParams.get("amount");

    return (
        <>
            <FreshNav />
            <div className="max-w-2xl mx-auto px-4 py-20 mt-28">
                <div className="bg-white border-2 border-green-500 rounded-lg p-8 text-center shadow-lg">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-green-700 mb-4">
                        Thanh toán thành công!
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                    </p>

                    {orderCode && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">Mã đơn hàng</p>
                            <p className="text-xl font-bold text-gray-800">{orderCode}</p>
                        </div>
                    )}

                    {amount && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">Số tiền đã thanh toán</p>
                            <p className="text-xl font-bold text-emerald-600">
                                {Number(amount).toLocaleString()} VND
                            </p>
                        </div>
                    )}

                    <div className="space-y-3 mt-8">
                        <p className="text-sm text-gray-500">
                            Chuyển hướng đến trang đơn hàng trong {countdown} giây...
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => router.push("/profile-page?tab=orders")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                Xem đơn hàng
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
