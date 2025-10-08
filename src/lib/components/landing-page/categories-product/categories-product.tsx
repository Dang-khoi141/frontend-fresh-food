"use client";

import { Eye, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useFetchProducts from "../../../hooks/useFetchProducts";

const CategoriesProduct = () => {
  const { products, loading, error, fetchProducts } = useFetchProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = products
    ? Array.from(new Set(products.map((p) => p.brand?.name || "Uncategorized")))
    : [];

  const filteredProducts = selectedCategory
    ? products?.filter((p) => (p.brand?.name || "Uncategorized") === selectedCategory)
    : products;

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);

    if (productGridRef.current) {
      const y = productGridRef.current.getBoundingClientRect().top + window.scrollY;
      const navHeight = 120;
      window.scrollTo({ top: y - navHeight, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-red-600">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Shop by Categories
          </h2>
          <p className="text-gray-500 mt-2">
            Chọn thương hiệu yêu thích và mua sắm ngay hôm nay
          </p>
          <div className="mt-3 w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-[500px] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh mục</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === null
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => {
                const rating = 4.5;
                const reviewCount = Math.floor(Math.random() * 20);
                const hasDiscount = Math.random() > 0.6;
                const discountPrice = hasDiscount
                  ? (product.price * 0.8).toFixed(2)
                  : null;

                return (
                  <div
                    key={product.id}
                    className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden"
                  >
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        -20%
                      </span>
                    )}

                    <div className="relative bg-gray-50 h-56 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="text-6xl">🍎</div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">
                        {product.brand?.name || "Uncategorized"}
                      </p>
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-emerald-700">
                          ${discountPrice || Number(product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center bg-emerald-600 text-white px-2 py-1 rounded text-xs gap-1">
                          <span>{rating}</span>
                          <Star className="h-3 w-3 fill-white" />
                        </div>
                        <span className="text-sm text-gray-500">({reviewCount})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts?.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Không tìm thấy sản phẩm nào trong danh mục này.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesProduct;
