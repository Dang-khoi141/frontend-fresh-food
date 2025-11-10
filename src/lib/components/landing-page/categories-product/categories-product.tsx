"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useFetchProducts from "../../../hooks/useFetchProducts";
import ProductCard from "../../common/product-card";

const CategoriesProduct = () => {
  const { products, loading, error, fetchProducts } = useFetchProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(
    () =>
      products
        ? Array.from(
          new Set(
            products.map((p) => p.category?.name?.toUpperCase() || "KHÁC")
          )
        ).sort()
        : [],
    [products]
  );

  const handleCategorySelect = useCallback((category: string | null) => {
    setSelectedCategory(category);

    if (productGridRef.current) {
      const y = productGridRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y - 150, behavior: "smooth" });
    }
  }, []);

  const groupedProducts = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    products?.forEach((p) => {
      const category = p.category?.name?.toUpperCase() || "KHÁC";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(p);
    });
    return grouped;
  }, [products]);

  if (loading)
    return (
      <section className="bg-gray-50 py-16 sm:py-20 text-center">
        <p className="text-gray-600 animate-pulse">Đang tải sản phẩm...</p>
      </section>
    );

  if (error)
    return (
      <section className="bg-gray-50 py-16 sm:py-20 text-center">
        <p className="text-red-600">{error.message}</p>
      </section>
    );

  return (
    <section className="bg-gray-50 py-10 sm:py-12 mt-24 sm:mt-28 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 px-4 sm:px-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-[250px] bg-white border border-gray-200 rounded-2xl shadow-sm p-5 fixed left-[calc((100vw-1280px)/2)] top-[130px] h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 z-20">
          <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2 tracking-wide">
            Danh mục sản phẩm
          </h3>

          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium uppercase transition-all ${selectedCategory === null
                    ? "bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                  }`}
              >
                Tất cả sản phẩm
              </button>
            </li>

            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium uppercase transition-all ${selectedCategory === cat
                      ? "bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                    }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Danh mục (hiện trên mobile, ẩn trên PC) */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Danh mục</h3>
            <button
              onClick={() => handleCategorySelect(null)}
              className="text-emerald-600 text-sm font-medium"
            >
              Xem tất cả
            </button>
          </div>
          <div className="flex overflow-x-auto gap-3 scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition ${selectedCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-500"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 md:ml-[280px]" ref={productGridRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory || "all"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 sm:space-y-12"
            >
              {Object.entries(groupedProducts)
                .filter(([category]) =>
                  selectedCategory ? category === selectedCategory : true
                )
                .map(([category, items]) => (
                  <div
                    key={category}
                    className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-5 border-b pb-2 gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-emerald-700 uppercase text-center sm:text-left">
                        {category}
                      </h3>
                      {!selectedCategory && (
                        <button
                          onClick={() => handleCategorySelect(category)}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                        >
                          Xem thêm →
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                      {items
                        .slice(0, selectedCategory ? items.length : 5)
                        .map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
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

export default CategoriesProduct;
