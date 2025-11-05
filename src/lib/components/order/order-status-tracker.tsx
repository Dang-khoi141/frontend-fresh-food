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
        { key: "PENDING", label: "Đơn hàng đã đặt", icon: <CheckCircle className="w-7 h-7" /> },
        { key: "CONFIRMED", label: "Đơn hàng đã xác nhận", icon: <CheckCircle className="w-7 h-7" /> },
        { key: "SHIPPED", label: "Đang giao hàng", icon: <Truck className="w-7 h-7" /> },
        { key: "DELIVERED", label: "Đã nhận hàng", icon: <Home className="w-7 h-7" /> },
    ];

    const stepsOnline = [
        { key: "PENDING", label: "Đơn hàng đã đặt", icon: <CheckCircle className="w-7 h-7" /> },
        { key: "PAID", label: "Đã thanh toán", icon: <CircleDollarSign className="w-7 h-7" /> },
        { key: "CONFIRMED", label: "Đã xác nhận", icon: <CheckCircle className="w-7 h-7" /> },
        { key: "SHIPPED", label: "Đang giao hàng", icon: <Truck className="w-7 h-7" /> },
        { key: "DELIVERED", label: "Đã nhận hàng", icon: <Home className="w-7 h-7" /> },
    ];

    let steps = paymentMethod === "ONLINE" ? stepsOnline : stepsCOD;

    if (status === "DELIVERED") {
        steps = [
            ...steps,
            {
                key: "REVIEW",
                label: "Đánh giá",
                icon: <Star className="w-7 h-7" />,
            },
        ];
    }

    const currentIndex = steps.findIndex((s) => s.key === status);

    return (
        <div className="w-full bg-white border rounded-lg p-6 shadow-sm mb-8">
            <div className="flex justify-between items-start relative">

                {steps.map((step, index) => {
                    const isActive = index <= currentIndex;

                    return (
                        <div key={step.key} className="flex flex-col items-center text-center flex-1 relative">
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                    absolute top-4 left-1/2 h-1 w-full -z-10
                    ${isActive ? "bg-green-500" : "bg-gray-300"}
                  `}
                                />
                            )}

                            <div
                                className={`
                  flex items-center justify-center rounded-full border-2 mb-2
                  ${isActive ? "border-green-600 text-green-600" : "border-gray-300 text-gray-400"}
                `}
                                style={{ width: 48, height: 48 }}
                            >
                                {step.icon}
                            </div>

                            <p
                                className={`
                  text-sm font-medium px-1
                  ${isActive ? "text-green-600" : "text-gray-500"}
                `}
                            >
                                {step.label}
                            </p>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
