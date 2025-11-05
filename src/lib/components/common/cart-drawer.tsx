"use client";

import { useCart } from "@/contexts/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
    if (!session) router.push("/login");
    else router.push("/cart");
  };

  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(productId, newQty);
      toast.success("Giỏ hàng đã được cập nhật");
    } catch {
      toast.error("Không thể cập nhật số lượng");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const formatPrice = (p: number) =>
    p.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = cart.reduce((s, i) => {
    const price =
      Number(i.unitPrice ?? i.product.finalPrice ?? i.product.price ?? 0);
    return s + price * i.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">

          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />

          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="relative w-[50vw] max-w-[430px] h-[70vh] mt-[15vh] mb-4 bg-white shadow-xl z-50 flex flex-col rounded-l-2xl rounded-tl-2xl overflow-hidden"
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-20 rounded-tl-2xl">
              <h2 className="font-bold text-lg">
                Giỏ hàng <span className="text-emerald-600">({cart.length})</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40">
              {cart.length === 0 && (
                <p className="text-gray-500 text-center py-10">
                  Chưa có sản phẩm nào.
                </p>
              )}

              {cart.map((item) => {
                const original = Number(item.product.price);
                const final = Number(item.unitPrice ??
                  item.product.finalPrice ??
                  item.product.price);

                const discount =
                  original > final
                    ? Math.round(((original - final) / original) * 100)
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 border rounded-xl p-3 bg-white hover:shadow-md transition"
                  >
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">
                        {item.product.name}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        {discount > 0 && (
                          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                            -{discount}%
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(original)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-red-600 mt-1">
                        {formatPrice(final)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          -
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-1"
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-5 border-t bg-white sticky bottom-0 z-20 rounded-bl-2xl shadow-lg">
              <p className="font-semibold text-lg mb-3 flex justify-between">
                <span>Tạm tính:</span>
                <span className="text-emerald-600">{formatPrice(subtotal)}</span>
              </p>

              <button
                onClick={handleViewCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Xem giỏ hàng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
