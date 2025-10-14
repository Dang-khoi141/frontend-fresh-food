"use client";

import { useEffect, useRef, useState } from "react";
import useFetchProducts from "../../../hooks/useFetchProducts";
import ProductCard from "../../common/product-card";
import { motion, AnimatePresence } from "framer-motion";

const CategoriesProduct = () => {
  const { products, loading, error, fetchProducts } = useFetchProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = products
    ? Array.from(new Set(products.map((p) => p.category?.name?.toUpperCase() || "KHÁC")))
    : [];

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);

    if (productGridRef.current) {
      const y = productGridRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y - 150, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <section className="bg-gray-50 py-20 text-center">
        <p className="text-gray-600 animate-pulse">Đang tải sản phẩm...</p>
      </section>
    );

  if (error)
    return (
      <section className="bg-gray-50 py-20 text-center">
        <p className="text-red-600">{error.message}</p>
      </section>
    );

  const groupedProducts: Record<string, typeof products> = {};
  products?.forEach((p) => {
    const category = p.category?.name?.toUpperCase() || "KHÁC";
    if (!groupedProducts[category]) groupedProducts[category] = [];
    groupedProducts[category].push(p);
  });

  return (
    <section className="bg-gray-50 py-12 mt-28 relative">
      <div className="max-w-7xl mx-auto flex gap-10 px-6">
        <aside
          className="w-[250px] bg-white border border-gray-200 rounded-2xl shadow-sm p-5 fixed left-[calc((100vw-1280px)/2)] top-[130px] h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 z-20"
        >
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


        <div className="flex-1 ml-[280px]" ref={productGridRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory || "all"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {Object.entries(groupedProducts)
                .filter(([category]) =>
                  selectedCategory ? category === selectedCategory : true
                )
                .map(([category, items]) => (
                  <div
                    key={category}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-5 border-b pb-2">
                      <h3 className="text-lg font-bold text-emerald-700 uppercase">
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
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
    </section>
  );
};

export default CategoriesProduct;
