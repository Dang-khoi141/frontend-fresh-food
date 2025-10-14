"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";
import Footer from "../../../lib/components/landing-page/footer/footer";
import { orderService, Order } from "../../../lib/service/order.service";
import Link from "next/link";
import { useAddressContext } from "../../../contexts/address-context";

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const { defaultAddress, refreshAddress } = useAddressContext();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await orderService.getOrderDetail(resolvedParams.orderId);
        setOrder(orderData);

        const fromPayment = sessionStorage.getItem(`from_payment_${resolvedParams.orderId}`);
        if (fromPayment === "true") {
          sessionStorage.removeItem(`from_payment_${resolvedParams.orderId}`);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.orderId, router]);

  useEffect(() => {
    refreshAddress();
  }, [defaultAddress]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      setCanceling(true);
      await orderService.cancelOrder(order.id);
      const updatedOrder = await orderService.getOrderDetail(order.id);
      setOrder(updatedOrder);
      alert("Đã hủy đơn hàng thành công");
    } catch (error: any) {
      console.error("Error canceling order:", error);
      alert(error.message || "Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setCanceling(false);
    }
  };

  const handlePayNow = () => {
    if (order) router.push(`/payment/${order.id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800" },
      PAID: { label: "Đã thanh toán", className: "bg-green-100 text-green-800" },
      SHIPPED: { label: "Đang giao", className: "bg-purple-100 text-purple-800" },
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
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <FreshNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center mt-28">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
          <Link href="/orders" className="text-emerald-600 hover:underline">
            Xem tất cả đơn hàng
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <FreshNav />
      <section className="max-w-4xl mx-auto px-4 py-10 mt-28 mb-10">
        <div className="mb-6">
          <Link href="/orders" className="text-emerald-600 hover:underline mb-4 inline-block">
            ← Quay lại danh sách đơn hàng
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
            <div>{getStatusBadge(order.status)}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold mb-3">Thông tin giao hàng</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress ||
                `${defaultAddress?.line1}, ${defaultAddress?.city}, ${defaultAddress?.province}`}
            </p>
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
              Tổng tiền:{" "}
              <strong className="text-emerald-600 text-lg">
                {formatPrice(Number(order.total || 0))}
              </strong>
            </p>
          </div>
        </div>

        <div className="border rounded-lg shadow-sm mb-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-semibold">Sản phẩm đã đặt</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left pb-2">Sản phẩm</th>
                  <th className="text-center pb-2">Số lượng</th>
                  <th className="text-right pb-2">Đơn giá</th>
                  <th className="text-right pb-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
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
                    <td className="text-center py-3">{item.quantity}</td>
                    <td className="text-right py-3">
                      {formatPrice(Number(item.unitPrice))}
                    </td>
                    <td className="text-right py-3 font-semibold">
                      {formatPrice(Number(item.unitPrice) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          {order.status === "PENDING" && order.paymentMethod === "ONLINE" && (
            <button
              onClick={handlePayNow}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Thanh toán ngay
            </button>
          )}

          {order.status === "PENDING" && (
            <button
              onClick={handleCancelOrder}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {canceling ? "Đang hủy..." : "Hủy đơn hàng"}
            </button>
          )}

          <Link
            href="/orders"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            Xem tất cả đơn hàng
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
