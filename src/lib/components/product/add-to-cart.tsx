"use client";

import { useState } from "react";

export default function AddToCart({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    console.log("Added to cart", { product, quantity });
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="px-4 font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={addToCart}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
      >
        MUA NGAY
      </button>
    </div>
  );
}
