"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

import Footer from "../../../lib/components/landing-page/footer/footer";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";

import OrderStatusTracker from "../../../lib/components/order/order-status-tracker";
import ReviewModal from "../../../lib/components/reviews/review-form";

import { useAddressContext } from "../../../contexts/address-context";
import { Order } from "../../../lib/interface/order";
import { IReview } from "../../../lib/interface/review";

import { orderService } from "../../../lib/service/order.service";
import { reviewService } from "../../../lib/service/review.service";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const { defaultAddress } = useAddressContext();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    image?: string;
  } | null>(null);
  const [existingReview, setExistingReview] = useState<IReview | null>(null);
  const [productReviews, setProductReviews] = useState<Record<string, IReview>>({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchAllProductReviews = useCallback(async (orderData: Order) => {
    if (orderData.status !== "DELIVERED") return;

    setLoadingReviews(true);
    try {
      const res = await reviewService.getMyReviews();
      const allReviews = Array.isArray(res.data) ? res.data : res || [];

      const productIds = new Set(orderData.items.map((i) => i.product.id));
      const reviewMap: Record<string, IReview> = {};

      allReviews.forEach((rev: any) => {
        const pid = rev.product?.id || rev.productId;
        if (pid && productIds.has(pid)) reviewMap[pid] = { ...rev, productId: pid };
      });

      setProductReviews(reviewMap);
    } catch (err) {
      console.warn("Unable to load reviews:", err);
      setProductReviews({});
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const ord = await orderService.getOrderDetail(resolvedParams.orderId);
        setOrder(ord);

        const fromPayment = sessionStorage.getItem(`from_payment_${resolvedParams.orderId}`);
        if (fromPayment === "true") {
          sessionStorage.removeItem(`from_payment_${resolvedParams.orderId}`);
        }

        if (ord.status === "DELIVERED") await fetchAllProductReviews(ord);
      } catch (err) {
        router.push("/profile-page?tab=orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [resolvedParams.orderId, router, fetchAllProductReviews]);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PAID: "bg-green-100 text-green-800",
      SHIPPED: "bg-violet-100 text-violet-800",
      DELIVERED: "bg-emerald-100 text-emerald-800",
      CANCELED: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      setCanceling(true);
      await orderService.cancelOrder(order.id);

      const updated = await orderService.getOrderDetail(order.id);
      setOrder(updated);

      alert("Hủy đơn hàng thành công");
    } catch (err: any) {
      alert(err.message ?? "Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setCanceling(false);
    }
  };

  const handlePayNow = () => {
    if (order) router.push(`/payment/${order.id}`);
  };

  const handleOpenReviewModal = (id: string, name: string, img?: string) => {
    setSelectedProduct({ id, name, image: img });
    setExistingReview(productReviews[id] || null);
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = async (rev: IReview) => {
    if (selectedProduct) {
      setProductReviews((p) => ({ ...p, [selectedProduct.id]: rev }));
    }

    try {
      const updated = await orderService.getOrderDetail(resolvedParams.orderId);
      setOrder(updated);
      await fetchAllProductReviews(updated);
    } catch { }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <FreshNav />
        <main className="flex-1 flex items-center justify-center mt-28">
          <div className="text-center">
            <div className="animate-spin h-16 w-16 border-b-4 border-emerald-600 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <FreshNav />
        <main className="flex-1 mt-28 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
          <Link href="/profile-page?tab=orders" className="text-emerald-600 hover:underline">
            Quay lại danh sách
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FreshNav />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-10 mt-32">
          <div className="mb-6">
            <Link
              href="/profile-page?tab=orders"
              className="text-emerald-600 hover:underline mb-4 inline-block"
            >
              ← Quay lại
            </Link>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">Chi tiết đơn hàng</h1>
                <p className="text-gray-600">
                  Mã đơn hàng: <strong>{order.orderNumber}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <OrderStatusTracker status={order.status} paymentMethod={order.paymentMethod} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-3">Thông tin giao hàng</h3>
              <p className="text-sm text-gray-600">{order.shippingAddress}</p>

              {order.notes && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-gray-500">Ghi chú: {order.notes}</p>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>
              <p className="text-sm">
                {order.paymentMethod === "COD"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Thanh toán trực tuyến"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Tổng tiền:
                <strong className="text-emerald-600 text-lg">
                  {" "}{formatPrice(order.total)}
                </strong>
              </p>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-semibold">Sản phẩm đã đặt</h3>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left pb-2">Sản phẩm</th>
                    <th className="text-center pb-2">SL</th>
                    <th className="text-right pb-2">Đơn giá</th>
                    <th className="text-right pb-2">Thành tiền</th>
                    {order.status === "DELIVERED" && <th>Đánh giá</th>}
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => {
                    const reviewed = !!productReviews[item.product.id];

                    return (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex gap-3 items-center">
                            <img
                              src={item.product.image || "/placeholder.png"}
                              alt={item.product.name}
                              className="w-12 h-12 object-contain border rounded"
                            />
                            <span className="font-medium">{item.product.name}</span>
                          </div>
                        </td>

                        <td className="text-center">{item.quantity}</td>

                        <td className="text-right">{formatPrice(item.unitPrice)}</td>

                        <td className="text-right font-semibold">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </td>

                        {order.status === "DELIVERED" && (
                          <td className="text-center">
                            <button
                              onClick={() =>
                                handleOpenReviewModal(
                                  item.product.id,
                                  item.product.name,
                                  item.product.image,
                                )
                              }
                              className={`px-3 py-1.5 text-sm rounded-md border transition
                                ${reviewed
                                  ? "text-blue-600 border-blue-600"
                                  : "text-emerald-600 border-emerald-600"
                                }
                              `}
                            >
                              {reviewed ? "Cập nhật" : "Đánh giá"}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {order.status === "PENDING" && order.paymentMethod === "ONLINE" && (
              <button
                onClick={handlePayNow}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
              >
                Thanh toán ngay
              </button>
            )}

            {order.status === "PENDING" && (
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {canceling ? "Đang hủy..." : "Hủy đơn hàng"}
              </button>
            )}
          </div>
        </section>
      </main>

      {reviewModalOpen && selectedProduct && (
        <ReviewModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productImage={selectedProduct.image}
          existingReview={existingReview}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      <Footer />
    </div>
  );
}
