"use client";

import ProductCard from "@/lib/components/common/product-card";
import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect } from "react";

import Footer from "@/lib/components/landing-page/footer/footer";
import FreshNav from "@/lib/components/landing-page/header/header-nav";

export default function FeaturedPage() {
    const { products, loading, fetchFeaturedProducts } = useFetchProducts();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <FreshNav />

            <main className="flex-1 mt-44 sm:mt-36 md:mt-32">
                <section className="max-w-7xl mx-auto px-6 py-10">

                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl">
                            <Star className="h-7 w-7 text-white fill-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Top Sản Phẩm Nổi Bật
                            </h1>
                            <p className="text-gray-600">
                                Được mua nhiều nhất trong 7 ngày gần nhất
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-72 bg-gray-200 animate-pulse rounded-xl"
                                ></div>
                            ))}
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.04 },
                                },
                            }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                        >
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0 },
                                    }}
                                    className="relative"
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
                    )}

                    {!loading && products.length === 0 && (
                        <p className="text-center text-gray-500 py-20">
                            Hiện chưa có sản phẩm nổi bật trong 7 ngày qua.
                        </p>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
