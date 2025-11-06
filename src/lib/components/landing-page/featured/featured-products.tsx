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
        <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-6">

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
                                Được mua nhiều nhất tuần qua
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/featured"
                        className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold border-2 border-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all"
                    >
                        <TrendingUp className="h-4 w-4" />
                        Xem thêm
                    </Link>
                </motion.div>

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
                            {index < 3 && (
                                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-white" />
                                    TOP {index + 1}
                                </div>
                            )}

                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
