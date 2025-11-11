"use client";

import ProductCard from "@/lib/components/common/product-card";
import useFetchProducts from "@/lib/hooks/useFetchProducts";
import { motion } from "framer-motion";
import { ChevronRight} from "lucide-react";
import Link from "next/link";
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

            <main className="flex-1 mt-[100px] md:mt-[130px]">
                <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
                        <Link href="/" className="hover:text-emerald-600 whitespace-nowrap transition-colors">
                            Trang chủ
                        </Link>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-gray-900 font-medium truncate">
                            Sản Phẩm Nổi Bật
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                Top Sản Phẩm Nổi Bật
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">
                                Được mua nhiều nhất trong 7 ngày gần nhất
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-64 sm:h-72 bg-gray-200 animate-pulse rounded-lg sm:rounded-xl"
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
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
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
                                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md shadow-lg flex items-center gap-0.5 sm:gap-1">
                                            TOP {index + 1}
                                        </div>
                                    )}

                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-8 sm:p-12 md:p-20 text-center">
                            <div className="max-w-md mx-auto">
                                <p className="text-sm sm:text-base md:text-lg text-gray-600">
                                    Hiện chưa có sản phẩm nổi bật trong 7 ngày qua.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white text-sm sm:text-base rounded-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
                                >
                                    Quay về trang chủ
                                </Link>
                            </div>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="sm:hidden mt-6 text-center">
                            <p className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg py-3 px-4">
                                Hiển thị <span className="font-semibold text-gray-900">{products.length}</span> sản phẩm nổi bật
                            </p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
