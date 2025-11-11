"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [showCancelModal, setShowCancelModal] = useState(false);

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
    `${price.toLocaleString("vi-VN")}đ`;

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Chờ xử lý",
      CONFIRMED: "Đã xác nhận",
      PAID: "Đã thanh toán",
      SHIPPED: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      CANCELED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

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
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${colors[status]}`}>
        {getStatusText(status)}
      </span>
    );
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setShowCancelModal(false);

    try {
      setCanceling(true);
      await orderService.cancelOrder(order.id);

      const updated = await orderService.getOrderDetail(order.id);
      setOrder(updated);

      toast.success("Hủy đơn hàng thành công");
    } catch (err: any) {
      toast.error(err.message ?? "Có lỗi xảy ra khi hủy đơn hàng");
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
        <main className="flex-1 flex items-center justify-center mt-20 sm:mt-28 px-4">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-emerald-600 rounded-full mx-auto"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Đang tải thông tin đơn hàng...</p>
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
        <main className="flex-1 mt-20 sm:mt-28 flex flex-col items-center justify-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Không tìm thấy đơn hàng</h2>
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
        <section className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 mt-20 sm:mt-32">
          <div className="mb-4 sm:mb-6">
            <Link
              href="/profile-page?tab=orders"
              className="text-emerald-600 hover:underline mb-3 sm:mb-4 inline-block text-sm sm:text-base"
            >
              ← Quay lại
            </Link>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2">Chi tiết đơn hàng</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Mã đơn hàng: <strong>{order.orderNumber}</strong>
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="self-start sm:self-auto">
                {getStatusBadge(order.status)}
              </div>
            </div>

            <OrderStatusTracker status={order.status} paymentMethod={order.paymentMethod} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Thông tin giao hàng</h3>
              <p className="text-xs sm:text-sm text-gray-600 break-words">{order.shippingAddress}</p>

              {order.notes && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs sm:text-sm text-gray-500">Ghi chú: {order.notes}</p>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Phương thức thanh toán</h3>
              <p className="text-xs sm:text-sm">
                {order.paymentMethod === "COD"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Thanh toán trực tuyến"}
              </p>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Tổng tiền:</span>
                  <span className="text-base sm:text-xl font-bold text-emerald-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm mb-4 sm:mb-6 bg-white">
            <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b">
              <h3 className="font-semibold text-sm sm:text-base">Sản phẩm đã đặt</h3>
            </div>

            <div className="p-3 sm:p-4">
              <div className="block sm:hidden space-y-3">
                {order.items.map((item) => {
                  const reviewed = !!productReviews[item.product.id];

                  return (
                    <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex gap-3 mb-3">
                        <img
                          src={item.product.image || "/placeholder.png"}
                          alt={item.product.name}
                          className="w-16 h-16 object-contain border rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2 mb-1">{item.product.name}</p>
                          <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">Đơn giá:</span>
                        <span>{formatPrice(item.unitPrice)}</span>
                      </div>

                      <div className="flex justify-between items-center font-semibold text-sm mb-3">
                        <span>Thành tiền:</span>
                        <span className="text-emerald-600">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>

                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() =>
                            handleOpenReviewModal(
                              item.product.id,
                              item.product.name,
                              item.product.image,
                            )
                          }
                          className={`w-full px-3 py-2 text-sm rounded-md border transition
                            ${reviewed
                              ? "text-blue-600 border-blue-600 bg-blue-50"
                              : "text-emerald-600 border-emerald-600 bg-emerald-50"
                            }
                          `}
                        >
                          {reviewed ? "Cập nhật đánh giá" : "Đánh giá sản phẩm"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left pb-2">Sản phẩm</th>
                      <th className="text-center pb-2">SL</th>
                      <th className="text-right pb-2">Đơn giá</th>
                      <th className="text-right pb-2">Thành tiền</th>
                      {order.status === "DELIVERED" && <th className="text-center pb-2">Đánh giá</th>}
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

                          <td className="text-right font-semibold text-emerald-600">
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
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            {order.status === "PENDING" && order.paymentMethod === "ONLINE" && (
              <button
                onClick={handlePayNow}
                className="w-full sm:w-auto bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-emerald-700"
              >
                Thanh toán ngay
              </button>
            )}

            {order.status === "PENDING" && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={canceling}
                className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </section>
      </main>

      {showCancelModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !canceling) {
              setShowCancelModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Xác nhận hủy đơn hàng
              </h3>

              <p className="text-center text-gray-600 mb-2">
                Bạn có chắc chắn muốn hủy đơn hàng này không?
              </p>

              <p className="text-center text-sm text-gray-500 mb-6">
                Đơn hàng: <span className="font-semibold">{order.orderNumber}</span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={canceling}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Không, giữ lại
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={canceling}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canceling ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang hủy...
                    </span>
                  ) : (
                    "Có, hủy đơn"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
