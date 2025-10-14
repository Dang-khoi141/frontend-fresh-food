"use client";

import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleViewCart = () => {
    if (!session) {
      router.push("/login");
    } else {
      router.push("/cart");
    }
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = cart.reduce(
    (s, i) => s + Number(i.product.price || 0) * i.quantity,
    0
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      <div className="relative w-96 h-full bg-white shadow-lg z-50 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Giỏ hàng ({cart.length})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 && (
            <p className="text-gray-500 text-center">Chưa có sản phẩm nào.</p>
          )}

          {cart.map((item, index) => {
            const price = Number(item.product.price || 0);

            return (
              <div
                key={item.id || `${item.product.id}-${index}`}
                className="flex gap-3 items-center"
              >
                <img
                  src={item.product.image || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-14 h-14 object-contain border rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(price)}
                  </p>
                  <div className="flex gap-2 items-center mt-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 text-xs"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <p className="font-semibold">Tạm tính: {formatPrice(subtotal)}</p>
          <button
            onClick={handleViewCart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded mt-2"
          >
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
