"use client";

import { useState } from "react";
import { Product } from "@/lib/interface/product";

export default function ProductTab({
    product,
    children,
}: {
    product: Product;
    children: React.ReactNode;
}) {
    const [active, setActive] = useState<"description" | "review">("description");

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex border-b mb-4 sm:mb-6 overflow-x-auto">
                <button
                    className={`px-3 sm:px-5 py-2 font-semibold text-sm sm:text-base whitespace-nowrap ${active === "description"
                            ? "text-emerald-600 border-b-2 border-emerald-500"
                            : "text-gray-500 hover:text-emerald-600"
                        }`}
                    onClick={() => setActive("description")}
                >
                    Mô tả sản phẩm
                </button>
                <button
                    className={`px-3 sm:px-5 py-2 font-semibold text-sm sm:text-base whitespace-nowrap ${active === "review"
                            ? "text-emerald-600 border-b-2 border-emerald-500"
                            : "text-gray-500 hover:text-emerald-600"
                        }`}
                    onClick={() => setActive("review")}
                >
                    Đánh giá
                </button>
            </div>

            {active === "description" ? (
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                </div>
            ) : (
                <div>{children}</div>
            )}
        </div>
    );
}