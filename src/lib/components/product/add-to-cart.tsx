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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          -
        </button>
        <span className="px-4 font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
      >
        THÊM VÀO GIỎ HÀNG
      </button>
    </div>
  );
}
