"use client";

import { useCart } from "@/contexts/cart-context";
import Link from "next/link";
import FreshNav from "../../lib/components/landing-page/header/header-nav";
import Footer from "../../lib/components/landing-page/footer/footer";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <>
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn trống</h2>
          <p className="text-gray-600 mb-6">
            Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm.
          </p>
          <Link
            href="/"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <FreshNav />
      <section className="max-w-5xl mx-auto px-4 py-10 mt-28">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Sản phẩm</th>
                <th className="text-left p-3">Giá</th>
                <th className="text-center p-3">Số lượng</th>
                <th className="text-right p-3">Tổng</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const price = Number(item.product.price || 0);
                return (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 flex gap-3 items-center">
                      <img
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-14 h-14 object-contain border rounded"
                      />
                      <span className="font-medium">{item.product.name}</span>
                    </td>

                    <td className="p-3">${price.toFixed(2)}</td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-right font-semibold">
                      ${(price * item.quantity).toFixed(2)}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={clearCart}
            className="text-red-600 hover:underline text-sm"
          >
            Xóa toàn bộ giỏ hàng
          </button>

          <div className="text-right space-y-3">
            <p className="text-lg font-semibold">
              Tạm tính:{" "}
              <span className="text-emerald-600">${subtotal.toFixed(2)}</span>
            </p>
            <div className="flex gap-3">
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
              >
                Tiếp tục mua hàng
              </Link>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold">
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
