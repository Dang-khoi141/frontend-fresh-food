"use client";

import { useEffect, useState } from "react";
import ProductCard from "../common/product-card";

export default function RelatedProducts({
  categoryId,
  currentId,
}: {
  categoryId: string;
  currentId: string;
}) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/search?categoryId=${categoryId}&limit=5`
        );
        const data = await res.json();
        setProducts(data.data.filter((p: any) => p.id !== currentId));
      } catch (err) {
        console.error(err);
      }
    };
    if (categoryId) fetchRelated();
  }, [categoryId, currentId]);

  if (!products.length) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-emerald-700 mb-4">
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
