"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useAddressContext } from "../../../../contexts/address-context";
import { useFetchOrder } from "../../../hooks/useFetchOrder";

const ORDER_STATUS = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xử lý" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "PAID", label: "Đã thanh toán" },
    { key: "SHIPPED", label: "Đang vận chuyển" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "CANCELED", label: "Đã hủy" },
];

export default function OrderList() {
    const { defaultAddress } = useAddressContext();

    const { orders, loading, error } = useFetchOrder({
        autoFetch: true,
    });

    const [activeStatus, setActiveStatus] = useState("ALL");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const getStatusBadge = (status: string) => {
        const map: any = {
            PENDING: "bg-yellow-100 text-yellow-800",
            CONFIRMED: "bg-blue-100 text-blue-800",
            PAID: "bg-green-100 text-green-800",
            SHIPPED: "bg-violet-100 text-violet-800",
            DELIVERED: "bg-emerald-100 text-emerald-800",
            CANCELED: "bg-red-100 text-red-800",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${map[status] || map.PENDING}`}>
                {ORDER_STATUS.find((s) => s.key === status)?.label || status}
            </span>
        );
    };

    const filteredOrders = useMemo(() => {
        let data = [...orders];

        if (activeStatus !== "ALL") {
            data = data.filter((o) => o.status === activeStatus);
        }

        return data.sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt).getTime();
            return dateB - dateA;
        });
    }, [orders, activeStatus]);

    const totalPages = Math.ceil(filteredOrders.length / pageSize);

    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredOrders.slice(start, start + pageSize);
    }, [filteredOrders, page, pageSize]);

    const formatPrice = (price: number) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Bạn chưa có đơn hàng nào</h2>
                <Link
                    href="/"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
                >
                    Bắt đầu mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Đơn hàng của tôi</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Quản lý và theo dõi đơn hàng của bạn
                </p>
            </div>

            <div className="px-6 py-4 border-b flex gap-3 overflow-x-auto scrollbar-hide">
                {ORDER_STATUS.map((s) => (
                    <button
                        key={s.key}
                        onClick={() => {
                            setActiveStatus(s.key);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition
                        ${activeStatus === s.key
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="p-6 space-y-4">
                {paginatedOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-semibold text-lg">Đơn hàng #{order.orderNumber}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                                </p>
                            </div>
                            {getStatusBadge(order.status)}
                        </div>

                        <div className="border-t pt-3 mb-3 text-sm text-gray-600">
                            <p className="mb-1">
                                <strong>Địa chỉ giao hàng:</strong>{" "}
                                {order.shippingAddress ||
                                    `${defaultAddress?.line1}, ${defaultAddress?.city}, ${defaultAddress?.province}`}
                            </p>
                            <p>
                                <strong>Phương thức thanh toán:</strong>{" "}
                                {order.paymentMethod === "COD"
                                    ? "Thanh toán khi nhận hàng"
                                    : "Trực tuyến"}
                            </p>
                        </div>

                        <div className="flex justify-between items-center border-t pt-3">
                            <div>
                                <p className="text-gray-600">
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
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <span>Hiển thị:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border rounded-lg px-3 py-1"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                    <span>mỗi trang</span>
                </div>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-3 py-1 rounded border ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
                            }`}
                    >
                        Trước
                    </button>

                    <span className="px-4 py-1">
                        Trang {page}/{totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-3 py-1 rounded border ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
                            }`}
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
