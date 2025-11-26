"use client";

import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import useOrderStatistics from "../../../lib/hooks/useOrderStatistics";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6", "#0ea5e9"];

const PERIOD_OPTIONS = [
    { value: "day" as const, label: "Hôm nay" },
    { value: "week" as const, label: "Tuần này" },
    { value: "month" as const, label: "Tháng này" },
];

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    PAID: "Đã thanh toán",
    CANCELED: "Đã hủy",
};

export default function StatisticsPage() {
    const { stats, loading, error, fetchStatistics } = useOrderStatistics();
    const [period, setPeriod] = useState<"day" | "week" | "month">("week");
<<<<<<< HEAD
    const [offset, setOffset] = useState<number>(0);
=======
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
            setIsPortrait(portrait);
        };

        checkOrientation();

        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);
>>>>>>> 4abf88fa9224fe8fa4734de85a04e8cc94a4bffc

    useEffect(() => {
        fetchStatistics(period, offset);
    }, [period, offset]);

    if (isPortrait) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 p-5 text-white">
                <style>
                    {`
                        @keyframes rotatePhone {
                            0%, 10% { transform: rotate(0deg); }
                            40%, 60% { transform: rotate(-90deg); }
                            90%, 100% { transform: rotate(0deg); }
                        }
                    `}
                </style>

                <div
                    className="relative mb-8 h-[110px] w-[64px] rounded-xl border-[3px] border-amber-500"
                    style={{ animation: 'rotatePhone 2.5s infinite ease-in-out' }}
                >
                    <div className="absolute left-1/2 top-2.5 h-0.5 w-5 -translate-x-1/2 rounded-sm bg-amber-500" />
                    <div className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-amber-500" />
                </div>

                <h3 className="mb-3 text-center text-lg font-semibold text-slate-50">
                    Vui lòng xoay ngang thiết bị
                </h3>

                <p className="max-w-[300px] text-center text-sm leading-relaxed text-slate-400">
                    Để có trải nghiệm tốt nhất và xem đầy đủ thông tin biểu đồ thống kê, vui lòng xoay ngang điện thoại của bạn.
                </p>
            </div>
        );
    }

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <p className="text-red-600 font-semibold text-lg">Đã xảy ra lỗi</p>
                <p className="text-gray-500 mt-2">{error.message}</p>
            </div>
        );

    if (!stats)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <p className="text-gray-500 text-lg">Không có dữ liệu thống kê</p>
            </div>
        );

    const statusData = Object.entries(stats.statusChart).map(([name, value]) => ({
        name: STATUS_LABELS[name] || name,
        value,
    }));

    const completionRate =
        stats.totalOrders > 0
            ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)
            : "0";

    const currentRangeLabel =
        offset === 0
            ? "Kỳ hiện tại"
            : offset === 1
                ? "Kỳ trước"
                : `Trước ${offset} kỳ`;

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Báo cáo thống kê</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Tổng quan hiệu suất kinh doanh hệ thống
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {currentRangeLabel} ({period === "day"
                                ? "Theo ngày"
                                : period === "week"
                                    ? "Theo tuần"
                                    : "Theo tháng"}
                            )
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                            {PERIOD_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setPeriod(option.value);
                                        setOffset(0);
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${period === option.value
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setOffset((prev) => prev + 1)}
                                className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            >
                                Kỳ trước
                            </button>
                            <button
                                disabled={offset === 0}
                                onClick={() => setOffset(0)}
                                className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                            >
                                Kỳ hiện tại
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Tổng doanh thu"
                        value={`${stats.totalRevenue.toLocaleString("vi-VN")}₫`}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Tổng đơn hàng"
                        value={stats.totalOrders.toString()}
                        color="text-indigo-600"
                    />
                    <StatCard
                        title="Đơn hoàn thành"
                        value={stats.completedOrders.toString()}
                        color="text-green-600"
                    />
                    <StatCard
                        title="Tỷ lệ hoàn thành"
                        value={`${completionRate}%`}
                        color="text-emerald-600"
                    />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Biểu đồ doanh thu theo thời gian
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={stats.chart}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "10px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Phân bổ trạng thái đơn hàng
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    label={(props) => `${((props as any).percent * 100).toFixed(0)}%`}
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "10px",
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <SummaryCard
                        title="Đơn trung bình"
                        value={
                            stats.totalOrders > 0
                                ? `${(stats.totalRevenue / stats.totalOrders).toLocaleString("vi-VN")}₫`
                                : "0₫"
                        }
                        description="Giá trị trung bình mỗi đơn hàng"
                    />
                    <SummaryCard
                        title="Tỷ lệ thành công"
                        value={`${completionRate}%`}
                        description="Tỷ lệ đơn hàng hoàn tất"
                    />
                    <SummaryCard
                        title="Tổng số đơn"
                        value={stats.totalOrders.toString()}
                        description="Trong kỳ báo cáo hiện tại"
                    />
                </section>
            </div>
        </main>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: string;
    color?: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className={`text-2xl font-semibold ${color || "text-gray-900"}`}>
                {value}
            </h3>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    description,
}: {
    title: string;
    value: string;
    description: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h4 className="text-2xl font-semibold text-gray-800">{value}</h4>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    );
}
