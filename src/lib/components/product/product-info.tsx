"use client";

import { Product } from "@/lib/interface/product";

export default function ProductInfo({ product }: { product: Product }) {
  const formatPrice = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-500">
        {product.brand?.name} • {product.category?.name}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-emerald-600">
          {formatPrice(Number(product.price))}
        </span>
      </div>

      {product.description && (
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      )}
    </div>
  );
}
