"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    brand?: { name: string };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) return router.push("/login");
    await addToCart(product.id, 1);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
      >
        <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-4xl">🛍️</div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-gray-500 mb-1 truncate">
            {product.brand?.name || "Thực phẩm"}
          </p>

          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug h-[40px]">
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-bold text-emerald-700">
              {Number(product.price).toLocaleString("vi-VN")}₫
            </span>

            <button
              onClick={handleAddToCart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
