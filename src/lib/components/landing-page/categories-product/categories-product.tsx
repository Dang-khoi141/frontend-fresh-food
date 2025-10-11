"use client";

import { useEffect, useRef, useState } from "react";
import useFetchProducts from "../../../hooks/useFetchProducts";
import ProductCard from "../../common/product-card";

const CategoriesProduct = () => {
  const { products, loading, error, fetchProducts } = useFetchProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = products
    ? Array.from(new Set(products.map(p => p.category?.name || "Uncategorized")))
    : [];

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (productGridRef.current) {
      const y =
        productGridRef.current.getBoundingClientRect().top + window.scrollY;
      const navHeight = 120;
      window.scrollTo({ top: y - navHeight, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-16 text-center">
        <p className="text-gray-600">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16 text-center">
        <p className="text-red-600">{error.message}</p>
      </section>
    );
  }

  const groupedProducts: Record<string, typeof products> = {};
  products?.forEach(product => {
    const category = product.category?.name || "Uncategorized";
    if (!groupedProducts[category]) groupedProducts[category] = [];
    groupedProducts[category].push(product);
  });

  return (
    <section className="bg-gray-50 py-10 mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-[500px] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === null
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === category
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3" ref={productGridRef}>
            {selectedCategory ? (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold mb-4">{selectedCategory}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {groupedProducts[selectedCategory]?.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {Object.entries(groupedProducts).map(([category, items]) => (
                  <div
                    key={category}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-6 border-b pb-2">
                      <h3 className="text-xl font-bold text-emerald-700 uppercase">
                        {category}
                      </h3>
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className="text-emerald-600 hover:underline text-sm font-semibold"
                      >
                        Xem thêm →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {items.slice(0, 5).map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesProduct;
