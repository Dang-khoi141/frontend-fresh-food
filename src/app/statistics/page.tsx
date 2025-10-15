"use client";


import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useOrderStatistics from "../../lib/hooks/useOrderStatistics";

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];

export default function StatisticsPage() {
    const { stats, loading, error, fetchStatistics } = useOrderStatistics();

    useEffect(() => {
        fetchStatistics("week");
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
                Đang tải dữ liệu...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
                Lỗi: {error.message}
            </div>
        );

    if (!stats)
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-400 text-lg">
                Không có dữ liệu thống kê
            </div>
        );

    const statusData = Object.entries(stats.statusChart).map(([name, value]) => ({
        name,
        value,
    }));

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                📊 Thống kê đơn hàng
            </h1>

            {/* Summary cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Tổng doanh thu tuần này</p>
                    <h2 className="text-4xl font-bold text-green-600 mt-2">
                        {stats.totalRevenue.toLocaleString("vi-VN")} ₫
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Tổng số đơn hàng</p>
                    <h2 className="text-4xl font-bold text-indigo-600 mt-2">
                        {stats.totalOrders}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">Đơn hàng hoàn thành</p>
                    <h2 className="text-4xl font-bold text-amber-500 mt-2">
                        {stats.completedOrders}
                    </h2>
                </div>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donut chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Trạng thái đơn hàng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Doanh thu theo ngày
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.chart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </main>
    );
}
