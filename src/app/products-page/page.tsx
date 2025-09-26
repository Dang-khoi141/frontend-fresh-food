"use client";

import { useEffect } from "react";
import ProductNav from "../../lib/components/header-product/header-product";
import useFetchProducts from "../../lib/hooks/useFetchProducts";

export default function ProductPage() {
  const { products, loading, error, fetchProducts } = useFetchProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading products...</div>;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">{error.message}</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full z-20 bg-white shadow">
        <ProductNav />
      </header>

      <main className="pt-32 p-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex gap-4">
            <select className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-emerald-200">
              <option>Khu vực</option>
              <option>Quận 1</option>
              <option>Quận 2</option>
              <option>Quận 7</option>
            </select>
            <select className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-emerald-200">
              <option>Phân loại</option>
              <option>Đồ chay</option>
              <option>Đồ uống</option>
              <option>Tráng miệng</option>
            </select>
          </div>
          <div>
            <select className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-emerald-200">
              <option>Sắp xếp</option>
              <option>Giá thấp → cao</option>
              <option>Giá cao → thấp</option>
              <option>Mới nhất</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={p.image || "/img/no-image.png"}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1 truncate">
                  {p.name}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  {p.brand?.name || "No Brand"}
                </p>
                <p className="text-emerald-600 font-bold mb-2">
                  {p.price.toLocaleString()} ₫
                </p>
                <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
                  Mã giảm 30.000đ
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
