"use client";

import { useState } from "react";
import FreshNav from "../../lib/components/landing-page/header/header-nav";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};



export default function ProductDemoPage() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreshNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Sản phẩm nổi bật
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        </div>
      </main>
    </div>
  );
}
