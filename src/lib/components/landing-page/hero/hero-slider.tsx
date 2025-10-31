"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFetchPromotions } from "@/lib/hooks/useFetchPromotion";

const HeroSlider = () => {
    const { activePromotions, loading } = useFetchPromotions();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!activePromotions.length) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activePromotions.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? activePromotions.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
    };

    if (loading) {
        return (
            <section className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-r from-emerald-50 to-emerald-100 animate-pulse" />
        );
    }

    if (!activePromotions.length) {
        return (
            <section className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 text-center text-white px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        Chào Mừng Đến FreshMart
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl mb-8"
                    >
                        Thực phẩm tươi sống - Giao hàng nhanh chóng
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all shadow-lg"
                    >
                        Mua Sắm Ngay
                    </motion.button>
                </div>
            </section>
        );
    }

    const currentPromo = activePromotions[currentIndex];

    return (
        <section className="relative w-full h-[400px] md:h-[500px] bg-gray-900 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500" />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
                        <div className="text-white max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm mb-4"
                            >
                                🔥 KHUYẾN MÃI HOT
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
                            >
                                {currentPromo.description || `Mã: ${currentPromo.code}`}
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-4 mb-6"
                            >
                                {currentPromo.discountPercent ? (
                                    <div className="bg-white text-emerald-600 px-6 py-3 rounded-lg">
                                        <span className="text-4xl font-bold">
                                            {currentPromo.discountPercent}%
                                        </span>
                                        <span className="text-sm ml-2">OFF</span>
                                    </div>
                                ) : currentPromo.discountAmount ? (
                                    <div className="bg-white text-emerald-600 px-6 py-3 rounded-lg">
                                        <span className="text-3xl font-bold">
                                            {Number(currentPromo.discountAmount).toLocaleString("vi-VN")}₫
                                        </span>
                                        <span className="text-sm ml-2">OFF</span>
                                    </div>
                                ) : null}

                                {currentPromo.minOrderValue && (
                                    <div className="text-lg">
                                        Đơn từ{" "}
                                        <span className="font-bold">
                                            {Number(currentPromo.minOrderValue).toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4"
                            >
                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                    <span className="text-sm">Mã:</span>
                                    <span className="font-bold ml-2 text-yellow-300 text-lg">
                                        {currentPromo.code}
                                    </span>
                                </div>

                                <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg">
                                    Mua Ngay →
                                </button>
                            </motion.div>

                            {currentPromo.endDate && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-sm mt-4 opacity-90"
                                >
                                    Có hiệu lực đến:{" "}
                                    {new Date(currentPromo.endDate).toLocaleDateString("vi-VN")}
                                </motion.p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {activePromotions.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {activePromotions.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {activePromotions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? "bg-white w-8"
                                : "bg-white/50 w-2 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSlider;
