"use client";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAddressContext } from "../../contexts/address-context";
import { useCart } from "../../contexts/cart-context";
import Footer from "../../lib/components/landing-page/footer/footer";
import FreshNav from "../../lib/components/landing-page/header/header-nav";
import ShippingAddressSection from "../../lib/components/shipping-address/shipping-address-sesion";
import { useFetchAddress } from "../../lib/hooks/useFetchAddress";
import { useApplyPromotion, useFetchPromotions } from "../../lib/hooks/useFetchPromotion";
import { formatPromotionDates } from "../../lib/interface/promotion";
import { orderService } from "../../lib/service/order.service";

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
  const { applyPromotion, clearPromotion, discount, appliedPromotion, loading: promoLoading, error: promoError } = useApplyPromotion();
  const { activePromotions, loading: promosLoading, error: promosError, refetch: refetchPromotions, isFetched } = useFetchPromotions();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [showPromoList, setShowPromoList] = useState(false);
  const router = useRouter();
  const normalizedAddress = shippingAddress.trim();

  const invalidPatterns = ["undefined", "undefine", "null", "unknown", "nan"];

  const isAddressInvalid =
    !normalizedAddress ||
    normalizedAddress.length < 5 ||
    /^[\s,]+$/.test(normalizedAddress) ||
    invalidPatterns.some(p => normalizedAddress.toLowerCase().includes(p));

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.unitPrice ?? item.product.finalPrice ?? item.product.price) * item.quantity,
    0
  );

  const discountAmount = Number(discount) || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const detectLocation = useCallback(async () => {
    if (!isAuthenticated || shippingAddress || isManualAddress) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`
            );

            if (!res.ok) throw new Error("Reverse geocode failed");

            const data = await res.json();
            const detected =
              data.display_name ||
              `${data.address?.road || ""}, ${data.address?.city || ""}, ${data.address?.state || ""
              }`;

            setShippingAddress(detected.trim());
          } catch {
            const msg = "Không thể xác định vị trí, vui lòng nhập địa chỉ thủ công.";
            toast.error(msg);
            setShippingAddress("");
            setIsManualAddress(true);
          }
        },
        (err) => console.warn("Không thể lấy vị trí:", err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [isAuthenticated, isManualAddress, shippingAddress]);

  useEffect(() => {
    if (isManualAddress) return;

    if (defaultAddress) {
      const line1 = defaultAddress.line1 || "";
      const city = defaultAddress.city || "";
      const province = defaultAddress.province || "";

      const combined = [line1, city, province]
        .filter((part) => part && part.trim().length > 0)
        .join(", ");

      if (combined && combined.replace(/[, ]/g, "").length >= 5) {
        setShippingAddress(combined);
      } else {
        setShippingAddress("");
      }
    } else {
      setShippingAddress("");
      detectLocation();
    }
  }, [defaultAddress, isManualAddress, detectLocation]);

  const handleApplyPromotion = async () => {
    if (!promoCode.trim()) {
      const msg = "Vui lòng nhập mã khuyến mãi";
      toast.error(msg);
      return;
    }

    const matchingPromo = activePromotions.find(
      (p) => p.code.toUpperCase() === promoCode.toUpperCase()
    );

    if (matchingPromo) {
      if (matchingPromo.minOrderValue && subtotal < matchingPromo.minOrderValue) {
        const msg = `Mã này yêu cầu tối thiểu ${formatPrice(matchingPromo.minOrderValue)}`;
        toast.error(msg);
        return;
      }
    }

    try {
      setError(null);
      await applyPromotion(promoCode, subtotal);
      setPromoCode("");
      setShowPromoList(false);
      toast.success("Áp dụng mã khuyến mãi thành công!");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Mã khuyến mãi không hợp lệ hoặc đã hết hạn";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleApplyFromList = async (code: string) => {
    try {
      setError(null);
      await applyPromotion(code, subtotal);
      setPromoCode("");
      setShowPromoList(false);
      toast.success("Áp dụng mã khuyến mãi thành công!");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Không thể áp dụng mã này";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleOpenPromoList = async () => {
    if (!showPromoList && !isFetched) {
      await refetchPromotions();
    }
    setShowPromoList(!showPromoList);
  };

  const handleClearPromotion = () => {
    clearPromotion();
    setPromoCode("");
    toast.success("Đã xóa mã khuyến mãi");
  };

  const handleShippingAddressChange = (address: string) => {
    setShippingAddress(address);
    setIsManualAddress(true);
  };

  const handlePlaceOrder = async () => {
    if (isAddressInvalid) {
      const msg = "Vui lòng nhập địa chỉ giao hàng chi tiết hơn";
      setError(msg);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        paymentMethod,
        shippingAddress: normalizedAddress,
        notes,
        promotionCode: appliedPromotion?.code,
      };

      const order = await orderService.createOrder(orderData);

      if (order?.id) {
        clearCart();
        toast.success("Đặt hàng thành công!");
        router.push(`/orders/${order.id}`);
      } else throw new Error("Order ID không hợp lệ");
    } catch (err: any) {
      let errorMsg = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đặt hàng";

      if (err.response?.status === 403) {
        errorMsg = "Bạn không có quyền đặt hàng";
        toast.error(errorMsg);
        setTimeout(() => router.push("/"), 1000);
        return;
      }

      if (err.response?.status === 401) {
        errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        setError(errorMsg);
        toast.error(errorMsg);
        router.push("/login");
        return;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-20 md:mt-28">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Giỏ hàng của bạn trống</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm.
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <FreshNav />
      <section className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-10 mt-20 sm:mt-28 mb-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Giỏ hàng</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center justify-between">
            <p className="font-medium text-xs md:text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-3 md:space-y-0">
            <div className="hidden md:block overflow-x-auto border rounded-lg shadow-sm">
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
                    const originalPrice = Number(item.product.price);
                    const discount = Number(item.product.discountPercentage || 0);
                    const finalPrice = Number(item.unitPrice ?? item.product.finalPrice ?? originalPrice);
                    const hasDiscount = discount > 0;

                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3 flex gap-3 items-center">
                          <img
                            src={item.product.image || "/placeholder.png"}
                            alt={item.product.name}
                            className="w-14 h-14 object-contain border rounded"
                          />
                          <span className="font-medium">{item.product.name}</span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col">
                            {hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(originalPrice)}
                              </span>
                            )}
                            <span className="font-semibold text-red-600">
                              {formatPrice(finalPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded mt-1 w-fit font-bold">
                                -{Math.round(discount)}%
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                              }
                              className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="p-3 text-right font-semibold text-emerald-700">
                          {formatPrice(finalPrice * item.quantity)}
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

            <div className="md:hidden space-y-3">
              {cart.map((item) => {
                const originalPrice = Number(item.product.price);
                const discount = Number(item.product.discountPercentage || 0);
                const finalPrice = Number(item.unitPrice ?? item.product.finalPrice ?? originalPrice);
                const hasDiscount = discount > 0;

                return (
                  <div key={item.id} className="border rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex gap-3">
                      <img
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain border rounded flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2">
                          {item.product.name}
                        </h3>

                        <div className="flex flex-col gap-1 mb-2">
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-red-600 text-sm">
                              {formatPrice(finalPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                -{Math.round(discount)}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                              }
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-semibold text-emerald-700 text-sm">
                            {formatPrice(finalPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="mt-2 w-full text-center text-red-500 hover:text-red-700 text-xs font-medium py-1"
                    >
                      Xóa sản phẩm
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
                <h3 className="font-semibold mb-3 text-sm md:text-base">Địa chỉ giao hàng</h3>
                <ShippingAddressSection
                  defaultAddress={defaultAddress}
                  createAddress={createAddress}
                  shippingAddress={shippingAddress}
                  setShippingAddress={handleShippingAddressChange}
                />
              </div>
              {!shippingAddress.trim() && (
                <p className="mt-1 text-xs text-red-500">
                  Vui lòng chọn hoặc nhập địa chỉ giao hàng trước khi đặt hàng.
                </p>
              )}

              {isAuthenticated && (
                <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3 text-sm md:text-base">Mã khuyến mãi</h3>
                  {appliedPromotion ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-emerald-700 text-sm">
                            {appliedPromotion.code}
                          </p>
                          <p className="text-xs text-gray-600">
                            {appliedPromotion.description}
                          </p>
                        </div>
                        <button
                          onClick={handleClearPromotion}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                      <p className="text-xs text-emerald-600 font-medium">
                        Giảm: {formatPrice(discountAmount)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Nhập mã..."
                          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          disabled={promoLoading}
                        />
                        <button
                          onClick={handleApplyPromotion}
                          disabled={promoLoading || !promoCode.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {promoLoading ? "..." : "Áp dụng"}
                        </button>
                      </div>

                      <button
                        onClick={handleOpenPromoList}
                        className="w-full text-xs md:text-sm text-emerald-600 hover:text-emerald-700 underline"
                      >
                        {showPromoList ? "Ẩn" : "Xem"} danh sách khuyến mãi
                      </button>

                      {showPromoList && (
                        <div className="bg-white border rounded-lg p-3 space-y-2 max-h-60 md:max-h-80 overflow-y-auto">
                          {promosError ? (
                            <div className="p-4 text-center">
                              <p className="text-xs md:text-sm text-red-600 mb-3">
                                Không thể tải danh sách khuyến mãi
                              </p>
                              <button
                                onClick={() => refetchPromotions()}
                                className="text-xs md:text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                              >
                                Thử lại
                              </button>
                            </div>
                          ) : promosLoading ? (
                            <p className="text-xs md:text-sm text-gray-500 text-center py-4">Đang tải...</p>
                          ) : activePromotions.length > 0 ? (
                            activePromotions.map((promo) => {
                              const canApply = !promo.minOrderValue || subtotal >= promo.minOrderValue;
                              const discountText = promo.discountPercent
                                ? `Giảm ${promo.discountPercent}%`
                                : `Giảm ${formatPrice(promo.discountAmount || 0)}`;

                              return (
                                <div
                                  key={promo.id}
                                  className={`p-2 md:p-3 border rounded-lg transition-all ${canApply
                                    ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400 cursor-pointer"
                                    : "bg-gray-50 border-gray-200 opacity-60"
                                    }`}
                                >
                                  <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-xs md:text-sm">{promo.code}</p>
                                      <p className="text-[10px] md:text-xs text-gray-600">
                                        {promo.description}
                                      </p>
                                    </div>
                                    <p className="font-semibold text-xs md:text-sm text-emerald-600">
                                      {discountText}
                                    </p>
                                  </div>

                                  <div className="text-[10px] md:text-xs text-gray-500 space-y-1 mb-2">
                                    {promo.minOrderValue && (
                                      <p>
                                        Tối thiểu:{" "}
                                        <span
                                          className={
                                            subtotal >= promo.minOrderValue
                                              ? "text-emerald-600"
                                              : "text-red-600"
                                          }
                                        >
                                          {formatPrice(promo.minOrderValue)}
                                        </span>
                                      </p>
                                    )}
                                    <p>Hạn: {formatPromotionDates(promo)}</p>
                                  </div>

                                  <button
                                    onClick={() =>
                                      canApply && handleApplyFromList(promo.code)
                                    }
                                    disabled={!canApply || promoLoading}
                                    className={`w-full py-1 md:py-1.5 rounded text-[10px] md:text-xs font-medium transition-all ${canApply
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      }`}
                                  >
                                    {!canApply
                                      ? "Không đủ điều kiện"
                                      : promoLoading
                                        ? "Đang xử lý..."
                                        : "Áp dụng"}
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs md:text-sm text-gray-500 text-center py-4">
                              Không có khuyến mãi nào
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
                <h3 className="font-semibold mb-3 text-sm md:text-base">Ghi chú đơn hàng</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)..."
                  className="w-full border rounded-lg p-2 md:p-3 text-xs md:text-sm min-h-[60px] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="border rounded-lg p-3 md:p-4 bg-gray-50">
                <h3 className="font-semibold mb-3 text-sm md:text-base">Phương thức thanh toán</h3>
                <div className="space-y-2">
                  {(["COD", "ONLINE"] as PaymentMethod[]).map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-3 p-2 md:p-3 border rounded-lg bg-white cursor-pointer hover:border-emerald-500"
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
                        <p className="font-medium text-xs md:text-sm">
                          {method === "COD"
                            ? "Thanh toán khi nhận hàng (COD)"
                            : "Thanh toán trực tuyến"}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          {method === "COD"
                            ? "Thanh toán bằng tiền mặt khi nhận hàng"
                            : "Thanh toán qua QR Code ngân hàng"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-3 md:p-4 space-y-3 bg-white">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-emerald-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Phí vận chuyển:</span>
                  <span className="text-emerald-600">Miễn phí</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-base md:text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-emerald-600">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3">
                <Link
                  href="/"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 md:px-5 py-3 rounded-lg text-center font-medium text-sm"
                >
                  <span className="hidden md:inline">Tiếp tục mua hàng</span>
                  <span className="md:hidden">Mua tiếp</span>
                </Link>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || isAddressInvalid}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-5 py-3 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "Đặt hàng"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
