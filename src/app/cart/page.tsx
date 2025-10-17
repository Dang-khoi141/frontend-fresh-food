"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../lib/components/landing-page/footer/footer";
import FreshNav from "../../lib/components/landing-page/header/header-nav";
import { useFetchAddress } from "../../lib/hooks/useFetchAddress";
import { orderService } from "../../lib/service/order.service";
import { useSession } from "next-auth/react";
import ShippingAddressSection from "../../lib/components/shipping-address/shipping-address-sesion";
import { useAddressContext } from "../../contexts/address-context";
import { useCart } from "../../contexts/cart-context";

const MapAddressInput = dynamic(
  () => import("../../lib/components/check-map/MapAddressInput"),
  { ssr: false }
);

type PaymentMethod = "COD" | "ONLINE";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const {
    createAddress,
  } = useFetchAddress(isAuthenticated);

  const { defaultAddress, refreshAddress } = useAddressContext();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.quantity,
    0
  );

  useEffect(() => {
    if (defaultAddress) {
      setShippingAddress(
        `${defaultAddress.line1}, ${defaultAddress.city}, ${defaultAddress.province}`
      );
    } else if (!shippingAddress && isAuthenticated && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`,
              {
                headers: { "Accept": "application/json" }
              }
            );

            if (!res.ok) throw new Error("Reverse geocode failed");

            const data = await res.json();
            const detected =
              data.display_name ||
              `${data.address?.road || ""}, ${data.address?.city || ""}, ${data.address?.state || ""
              }`;
            setShippingAddress(detected.trim());
          } catch (err) {
            console.warn("Không thể lấy vị trí:", err);
            setShippingAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (err) => console.warn("Không thể lấy vị trí:", err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [defaultAddress, shippingAddress, isAuthenticated]);


  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        paymentMethod,
        shippingAddress,
        notes,
      };

      const order = await orderService.createOrder(orderData);

      if (order?.id) {
        clearCart();
        router.push(`/orders/${order.id}`);
      } else throw new Error("Order ID không hợp lệ");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra khi đặt hàng"
      );
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

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
                    <td className="p-3">{formatPrice(price)}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatPrice(price * item.quantity)}
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

        <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-6">
          <button
            onClick={clearCart}
            className="text-red-600 hover:underline text-sm"
          >
            Xóa toàn bộ giỏ hàng
          </button>

          <div className="flex-1 max-w-md space-y-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Địa chỉ giao hàng</h3>
              <ShippingAddressSection
                defaultAddress={defaultAddress}
                createAddress={createAddress}
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
              />
            </div>



            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Ghi chú đơn hàng</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)..."
                className="w-full border rounded-lg p-3 text-sm min-h-[60px] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>
              <div className="space-y-2">
                {(["COD", "ONLINE"] as PaymentMethod[]).map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-pointer hover:border-emerald-500"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="w-4 h-4 text-emerald-600"
                    />
                    <div>
                      <p className="font-medium">
                        {method === "COD"
                          ? "Thanh toán khi nhận hàng (COD)"
                          : "Thanh toán trực tuyến"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method === "COD"
                          ? "Thanh toán bằng tiền mặt khi nhận hàng"
                          : "Thanh toán qua QR Code ngân hàng"}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span className="text-emerald-600">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-emerald-600">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-lg text-center font-medium"
              >
                Tiếp tục mua hàng
              </Link>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !shippingAddress.trim()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
