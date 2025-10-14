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
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex border-b mb-6">
                <button
                    className={`px-5 py-2 font-semibold ${active === "description"
                            ? "text-emerald-600 border-b-2 border-emerald-500"
                            : "text-gray-500 hover:text-emerald-600"
                        }`}
                    onClick={() => setActive("description")}
                >
                    Mô tả sản phẩm
                </button>
                <button
                    className={`px-5 py-2 font-semibold ${active === "review"
                            ? "text-emerald-600 border-b-2 border-emerald-500"
                            : "text-gray-500 hover:text-emerald-600"
                        }`}
                    onClick={() => setActive("review")}
                >
                    Đánh giá
                </button>
            </div>

            {active === "description" ? (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                </div>
            ) : (
                <div>{children}</div>
            )}
        </div>
    );
}
