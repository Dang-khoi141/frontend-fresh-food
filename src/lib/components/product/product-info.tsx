"use client";

import { Product } from "@/lib/interface/product";

export default function ProductInfo({ product }: { product: Product }) {
  const formatPrice = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const originalPrice = Number(product.price);
  const discount = Number(product.discountPercentage || 0);
  const finalPrice = originalPrice * (1 - discount / 100);


  const hasDiscount = discount > 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-500">
        {product.brand?.name} • {product.category?.name}
      </p>

      {hasDiscount ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          </div>

          <span className="text-3xl font-bold text-red-600">
            {formatPrice(finalPrice)}
          </span>
        </div>
      ) : (
        <span className="text-3xl font-bold text-emerald-600">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
