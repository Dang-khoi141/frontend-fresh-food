"use client";

import { Spin } from "antd";
import FreshNav from "../../lib/components/landing-page/header/header-nav";
import Footer from "../../lib/components/landing-page/footer/footer";
import Link from "next/link";
import { useAddressContext } from "../../contexts/address-context";
import { useFetchOrder } from "../../lib/hooks/useFetchOrder";

export default function OrdersPage() {
  const { defaultAddress } = useAddressContext();
  const { orders, loading, error } = useFetchOrder({
    autoFetch: true,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800" },
      PAID: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
      SHIPPED: { label: "Đang vận chuyển", className: "bg-violet-100 text-violet-800" },
      DELIVERED: { label: "Đã giao", className: "bg-emerald-100 text-emerald-800" },
      CANCELED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  if (loading) {
    return (
      <>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center mt-28">
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center mt-28">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Link
            href="/"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <h2 className="text-2xl font-bold mb-4">Bạn chưa có đơn hàng nào</h2>
          <p className="text-gray-600 mb-6">
            Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên.
          </p>
          <Link
            href="/"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
          >
            Bắt đầu mua sắm
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <>
      <FreshNav />
      <section className="max-w-6xl mx-auto px-4 py-10 mt-28 mb-10">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg">Đơn hàng #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="border-t pt-3 mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Địa chỉ giao hàng:</strong>{" "}
                  {order.shippingAddress || `${defaultAddress?.line1}, ${defaultAddress?.city}, ${defaultAddress?.province}`}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Trực tuyến"}
                </p>
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <div>
                  <p className="text-sm text-gray-600">
                    Tổng cộng:{" "}
                    <strong className="text-emerald-600 text-lg">
                      {formatPrice(Number(order.total || 0))}
                    </strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items.length} sản phẩm
                  </p>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
