"use client";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/lib/interface/product";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleAdd = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (product.id) {
      await addToCart(product.id, quantity);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };


  return (
    <>
      <div className="space-y-4">
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
          onClick={handleAdd}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg"
        >
          MUA NGAY
        </button>
      </div>

      {showPopup && (
        <div className="fixed top-20 right-5 bg-white shadow-lg border rounded-lg p-4 w-72 animate-fade-in">
          <p className="font-medium text-emerald-700">Đã thêm vào giỏ!</p>
          <div className="flex gap-2 mt-2">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-gray-500">x{quantity}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
