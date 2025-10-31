"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import ProductCard from "../../common/product-card";
import useFetchProducts from "@/lib/hooks/useFetchProducts";

const FlashSale = () => {
    const { products, loading, fetchProducts } = useFetchProducts();
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // Reset to 24 hours when countdown ends
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <section className="bg-gradient-to-br from-red-50 to-orange-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-12 bg-white/50 rounded-xl w-96 mb-6 animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products?.length) return null;

    // Get first 6 products for flash sale
    const flashSaleProducts = products.slice(0, 6);

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white text-red-600 font-bold text-2xl md:text-3xl px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-lg min-w-[60px] md:min-w-[70px] text-center">
                {String(value).padStart(2, "0")}
            </div>
            <span className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                {label}
            </span>
        </div>
    );

    return (
        <section className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ff0000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-white"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl">
                            <Flame className="h-6 w-6 md:h-7 md:w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                                FLASH SALE
                            </h2>
                            <p className="text-xs md:text-sm text-gray-600 font-medium">
                                Giá sốc - Số lượng có hạn
                            </p>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-2">
                            <Clock className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-semibold text-gray-700">
                                Kết thúc sau:
                            </span>
                        </div>
                        <TimeBlock value={timeLeft.hours} label="Giờ" />
                        <span className="text-2xl font-bold text-red-600 mx-1">:</span>
                        <TimeBlock value={timeLeft.minutes} label="Phút" />
                        <span className="text-2xl font-bold text-red-600 mx-1">:</span>
                        <TimeBlock value={timeLeft.seconds} label="Giây" />
                    </div>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                    {flashSaleProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Flash Sale Badge */}
                            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                                -20%
                            </div>

                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* View More Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105">
                        Xem Tất Cả Flash Sale →
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FlashSale;
