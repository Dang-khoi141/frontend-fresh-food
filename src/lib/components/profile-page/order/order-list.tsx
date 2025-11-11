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
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${map[status] || map.PENDING}`}>
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
            <div className="bg-white rounded-lg p-6 sm:p-10 text-center shadow-sm">
                <div className="animate-spin h-10 w-10 sm:h-12 sm:w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-sm sm:text-base text-gray-600">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-6 sm:p-10 text-center shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 sm:px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-lg p-8 sm:p-12 text-center shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Bạn chưa có đơn hàng nào</h2>
                <Link
                    href="/"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold inline-block text-sm sm:text-base"
                >
                    Bắt đầu mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Đơn hàng của tôi</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Quản lý và theo dõi đơn hàng của bạn
                </p>
            </div>

            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {ORDER_STATUS.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => {
                                setActiveStatus(s.key);
                                setPage(1);
                            }}
                            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition ${activeStatus === s.key
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                {paginatedOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                            <div className="flex-1">
                                <p className="font-semibold text-base sm:text-lg">Đơn hàng #{order.orderNumber}</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                                </p>
                            </div>
                            <div className="self-start sm:self-auto">
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        <div className="border-t pt-3 mb-3 text-xs sm:text-sm text-gray-600 space-y-1.5 sm:space-y-1">
                            <div>
                                <strong className="text-gray-700">Địa chỉ giao hàng:</strong>
                                <p className="mt-0.5 sm:mt-0 sm:inline sm:ml-1">
                                    {order.shippingAddress ||
                                        `${defaultAddress?.line1}, ${defaultAddress?.city}, ${defaultAddress?.province}`}
                                </p>
                            </div>
                            <div>
                                <strong className="text-gray-700">Phương thức thanh toán:</strong>
                                <span className="ml-1">
                                    {order.paymentMethod === "COD"
                                        ? "Thanh toán khi nhận hàng"
                                        : "Trực tuyến"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-t pt-3">
                            <div className="flex-1">
                                <p className="text-sm sm:text-base text-gray-600">
                                    Tổng cộng:{" "}
                                    <strong className="text-emerald-600 text-base sm:text-lg">
                                        {formatPrice(Number(order.total || 0))}
                                    </strong>
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {order.items.length} sản phẩm
                                </p>
                            </div>
                            <Link
                                href={`/orders/${order.id}`}
                                className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm">
                    <span className="text-gray-600">Hiển thị:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                    <span className="text-gray-600">mỗi trang</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-3 py-1.5 sm:py-1 rounded border text-xs sm:text-sm ${page === 1
                            ? "opacity-40 cursor-not-allowed bg-gray-50"
                            : "hover:bg-gray-100 active:bg-gray-200"
                            }`}
                    >
                        Trước
                    </button>

                    <span className="px-3 sm:px-4 py-1.5 sm:py-1 text-xs sm:text-sm font-medium">
                        Trang {page}/{totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-3 py-1.5 sm:py-1 rounded border text-xs sm:text-sm ${page === totalPages
                            ? "opacity-40 cursor-not-allowed bg-gray-50"
                            : "hover:bg-gray-100 active:bg-gray-200"
                            }`}
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
