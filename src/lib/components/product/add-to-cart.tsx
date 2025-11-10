"use client";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/lib/interface/product";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: session } = useSession();
  const router = useRouter();

  const handleAdd = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (product.id) {
      await addToCart(product.id, quantity);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng");
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          -
        </button>
        <span className="px-3 sm:px-4 font-medium text-sm sm:text-base">{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition text-sm sm:text-base"
      >
        THÊM VÀO GIỎ HÀNG
      </button>
    </div>
  );
}