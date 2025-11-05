"use client";

import { useCart } from "@/contexts/cart-context";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ProductCardProps } from "../../interface/product";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) return router.push("/login");

    await addToCart(product.id, 1);
    toast.success("Sản phẩm đã được thêm vào giỏ hàng");
  };

  const discountPercentage = (product as any).discountPercentage || 0;
  const originalPrice = Number(product.price);
  const finalPrice = (product as any).finalPrice || originalPrice;
  const hasDiscount = discountPercentage > 0;

  const avgRating = (product as any).avgRating || 0;
  const reviewCount = (product as any).reviewCount || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
    >
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          -{Math.round(Math.abs(discountPercentage))}%
        </div>
      )}

      <Link href={`/products/${product.id}`}>
        <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-4xl">🛒</div>
          )}
        </div>

        <div className="p-4 pb-0">
          <p className="text-xs text-gray-500 mb-1 truncate">
            {product.brand?.name || "Thực phẩm"}
          </p>

          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug h-[40px] mb-2">
            {product.name}
          </h3>
        </div>
      </Link>

      {reviewCount > 0 && (
        <div className="px-4 flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>
      )}

      <div className="p-4 mt-auto">
        {hasDiscount ? (
          <div className="flex flex-col gap-1 mb-3">
            <span className="text-xs text-gray-400 line-through">
              {originalPrice.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-base font-bold text-red-600">
              {Math.round(finalPrice).toLocaleString("vi-VN")}₫
            </span>
          </div>
        ) : (
          <span className="text-base font-bold text-emerald-700 mb-3 block">
            {originalPrice.toLocaleString("vi-VN")}₫
          </span>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-sm font-medium">Thêm giỏ hàng</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
