"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import ProductCard from "../../common/product-card";
import useFetchProducts from "@/lib/hooks/useFetchProducts";

const FeaturedProducts = () => {
    const { products, loading, fetchProducts } = useFetchProducts();

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-10 bg-gray-200 rounded w-80 mb-8 animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products?.length) return null;

    // Get featured products (first 10)
    const featuredProducts = products.slice(6, 16);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl">
                            <Star className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Sản Phẩm Nổi Bật
                            </h2>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Được yêu thích nhất tại FreshMart
                            </p>
                        </div>
                    </div>

                    <button className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold border-2 border-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all">
                        <TrendingUp className="h-4 w-4" />
                        Xem thêm
                    </button>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                >
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            variants={item}
                            className="relative group"
                        >
                            {/* Featured Badge */}
                            {index < 3 && (
                                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-white" />
                                    TOP {index + 1}
                                </div>
                            )}

                            <ProductCard product={product} />

                            {/* Hover overlay with "Hot" indicator */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none flex items-end justify-center pb-4">
                                <span className="text-white font-bold text-sm">
                                    🔥 Đang hot
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile View More Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="md:hidden text-center mt-6"
                >
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Xem Tất Cả Sản Phẩm
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
