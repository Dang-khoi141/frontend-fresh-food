"use client";

import { useFetchPromotions } from "@/lib/hooks/useFetchPromotion";
import { motion } from "framer-motion";
import { Gift, Percent, Tag } from "lucide-react";
import { useEffect } from "react";

const PromotionBanners = () => {
    const { activePromotions, loading, refetch } = useFetchPromotions();

    useEffect(() => {
        refetch();
    }, []);

    if (loading || !activePromotions.length) return null;

    // Show max 3 promotions
    const displayPromotions = activePromotions.slice(0, 3);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 },
    };

    return (
        <section className="bg-white py-6 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {displayPromotions.map((promo, index) => {
                        const Icon = index === 0 ? Tag : index === 1 ? Gift : Percent;
                        const gradients = [
                            "from-emerald-500 to-teal-500",
                            "from-blue-500 to-indigo-500",
                            "from-purple-500 to-pink-500",
                        ];

                        return (
                            <motion.div
                                key={promo.id}
                                variants={item}
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-[2px] hover:scale-105 transition-transform cursor-pointer"
                                style={{
                                    background: `linear-gradient(135deg, ${index === 0
                                        ? "#10b981, #14b8a6"
                                        : index === 1
                                            ? "#3b82f6, #6366f1"
                                            : "#a855f7, #ec4899"
                                        })`,
                                }}
                            >
                                <div className="bg-white rounded-xl p-4 h-full flex items-center gap-4">
                                    <div
                                        className={`bg-gradient-to-br ${gradients[index]} p-3 rounded-lg flex-shrink-0`}
                                    >
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
                                            {promo.description || `Mã: ${promo.code}`}
                                        </h3>

                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            {promo.discountPercent && (
                                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-semibold">
                                                    -{promo.discountPercent}%
                                                </span>
                                            )}
                                            {promo.discountAmount && (
                                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-semibold">
                                                    -{Number(promo.discountAmount).toLocaleString()}₫
                                                </span>
                                            )}
                                            <span className="text-emerald-600 font-semibold">
                                                {promo.code}
                                            </span>
                                        </div>

                                        {promo.minOrderValue && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Đơn tối thiểu{" "}
                                                {Number(promo.minOrderValue).toLocaleString("vi-VN")}₫
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        className={`bg-gradient-to-r ${gradients[index]} text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg transition-all flex-shrink-0`}
                                    >
                                        Dùng ngay
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default PromotionBanners;
