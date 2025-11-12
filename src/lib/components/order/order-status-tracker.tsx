"use client";

import { Order } from "@/lib/interface/order";
import {
    CheckCircle,
    CircleDollarSign,
    Home,
    Star,
    Truck,
} from "lucide-react";

interface Props {
    status: Order["status"];
    paymentMethod: Order["paymentMethod"];
}

export default function OrderStatusTracker({ status, paymentMethod }: Props) {
    const stepsCOD = [
        { key: "PENDING", label: "Đơn hàng đã đặt", shortLabel: "Đã đặt", icon: <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "CONFIRMED", label: "Đơn hàng đã xác nhận", shortLabel: "Xác nhận", icon: <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "SHIPPED", label: "Đang giao hàng", shortLabel: "Đang giao", icon: <Truck className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "DELIVERED", label: "Đã nhận hàng", shortLabel: "Đã nhận", icon: <Home className="w-5 h-5 sm:w-7 sm:h-7" /> },
    ];

    const stepsOnline = [
        { key: "PENDING", label: "Đơn hàng đã đặt", shortLabel: "Đã đặt", icon: <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "PAID", label: "Đã thanh toán", shortLabel: "Đã TT", icon: <CircleDollarSign className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "CONFIRMED", label: "Đã xác nhận", shortLabel: "Xác nhận", icon: <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "SHIPPED", label: "Đang giao hàng", shortLabel: "Đang giao", icon: <Truck className="w-5 h-5 sm:w-7 sm:h-7" /> },
        { key: "DELIVERED", label: "Đã nhận hàng", shortLabel: "Đã nhận", icon: <Home className="w-5 h-5 sm:w-7 sm:h-7" /> },
    ];

    let steps = paymentMethod === "ONLINE" ? stepsOnline : stepsCOD;

    if (status === "DELIVERED") {
        steps = [
            ...steps,
            {
                key: "REVIEW",
                label: "Đánh giá",
                shortLabel: "Đánh giá",
                icon: <Star className="w-5 h-5 sm:w-7 sm:h-7" />,
            },
        ];
    }

    const currentIndex = steps.findIndex((s) => s.key === status);

    return (
        <div className="w-full bg-white border rounded-lg p-3 sm:p-6 shadow-sm my-4 sm:mb-8">
            <div className="block sm:hidden">
                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const isActive = index <= currentIndex;

                        return (
                            <div key={step.key} className="relative">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`
                                            flex items-center justify-center rounded-full border-2 flex-shrink-0
                                            ${isActive ? "border-green-600 text-green-600 bg-green-50" : "border-gray-300 text-gray-400"}
                                        `}
                                        style={{ width: 40, height: 40 }}
                                    >
                                        {step.icon}
                                    </div>

                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${isActive ? "text-green-600" : "text-gray-500"}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                </div>

                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                            absolute left-5 top-10 w-0.5 h-6
                                            ${isActive && index < currentIndex ? "bg-green-500" : "bg-gray-300"}
                                        `}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="hidden sm:flex justify-between items-start relative">
                {steps.map((step, index) => {
                    const isActive = index <= currentIndex;

                    return (
                        <div key={step.key} className="flex flex-col items-center text-center flex-1 relative">
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                                        absolute top-6 left-1/2 h-1 w-full -z-10
                                        ${isActive && index < currentIndex ? "bg-green-500" : "bg-gray-300"}
                                    `}
                                />
                            )}

                            <div
                                className={`
                                    flex items-center justify-center rounded-full border-2 mb-2
                                    ${isActive ? "border-green-600 text-green-600 bg-green-50" : "border-gray-300 text-gray-400"}
                                `}
                                style={{ width: 48, height: 48 }}
                            >
                                {step.icon}
                            </div>

                            <p className={`text-sm font-medium px-1 ${isActive ? "text-green-600" : "text-gray-500"}`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
