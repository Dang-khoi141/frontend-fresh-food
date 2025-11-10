"use client";

import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import ProductCard from "../../common/product-card";

const FeaturedProducts = () => {
    const { products, loading, fetchFeaturedProducts } = useFetchProducts();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    if (loading) return <></>;
    if (!products?.length) return null;

    const featuredProducts = products.slice(0, 10);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section className="bg-gray-50 py-10 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Tiêu đề */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 text-center sm:text-left"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl sm:p-2.5">
                            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900">
                                Sản Phẩm Nổi Bật
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Được mua nhiều nhất tuần qua
                            </p>
                        </div>
                    </div>

                    {/* Nút "Xem thêm" — chỉ hiện PC/Tablet */}
                    <Link
                        href="/featured"
                        className="hidden sm:inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold border-2 border-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all"
                    >
                        <TrendingUp className="h-4 w-4" />
                        Xem thêm
                    </Link>
                </motion.div>

                {/* Grid sản phẩm */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
                >
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            variants={item}
                            className="relative group"
                        >
                            {index < 3 && (
                                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-md flex items-center gap-0.5 sm:gap-1">
                                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-white" />
                                    TOP {index + 1}
                                </div>
                            )}
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Nút xem thêm — chỉ hiện mobile */}
                <div className="sm:hidden flex justify-center mt-8">
                    <Link
                        href="/featured"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold border-2 border-emerald-600 hover:bg-emerald-50 px-5 py-2 rounded-lg transition-all"
                    >
                        <TrendingUp className="h-4 w-4" />
                        Xem thêm
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
