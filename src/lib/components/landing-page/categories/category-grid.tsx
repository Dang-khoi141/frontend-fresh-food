"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useFetchCategories from "../../../hooks/useFetchCategories";

const CategoryGrid = () => {
    const { categories, loading, error, fetchCategories } = useFetchCategories();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        fetchCategories(false);
    }, []);

    useEffect(() => {
        checkScrollButtons();
    }, [categories]);

    const checkScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth * 0.8;
        const targetScroll =
            direction === "left"
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        });

        setTimeout(checkScrollButtons, 300);
    };

    if (loading) {
        return (
            <section className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || !categories?.length) {
        return null;
    }

    return (
        <section className="bg-white py-12 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Danh Mục Sản Phẩm</h2>
                </div>

                <div className="relative group">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-6 w-6 text-gray-700" />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-6 w-6 text-gray-700" />
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScrollButtons}
                        className="overflow-x-auto scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <div
                            className="grid grid-flow-col auto-cols-[minmax(90px,1fr)] gap-4"
                            style={{
                                gridTemplateRows: "repeat(2, 1fr)",
                                gridAutoFlow: "column",
                            }}
                        >
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <Link href={`/categories/${category.id}`}>
                                        <div className="group cursor-pointer">
                                            <div className="relative w-full aspect-square bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl overflow-hidden border border-gray-200 hover:border-emerald-500 transition-all hover:shadow-lg">
                                                {category.imageUrl ? (
                                                    <img
                                                        src={category.imageUrl}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                                                        🛒
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            <p className="text-center mt-2 text-xs font-medium text-gray-700 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight px-1">
                                                {category.name}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex justify-center mt-4 gap-2">
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                        <span>Vuốt để xem thêm</span>
                        <ChevronRight className="h-3 w-3" />
                    </div>
                </div>
            </div>

            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
};

export default CategoryGrid;
