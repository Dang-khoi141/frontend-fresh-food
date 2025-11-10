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

  const discount = Number(product.discountPercentage ?? 0);
  const price = Number(product.price);
  const finalPrice = Number(product.finalPrice ?? price);
  const hasDiscount = discount > 0;

  const avgRating = (product as any).avgRating || 0;
  const reviewCount = (product as any).reviewCount || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
    >
      {hasDiscount && (
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg">
          -{Math.round(Math.abs(discount))}%
        </div>
      )}

      <Link href={`/products/${product.id}`} className="flex flex-col flex-1">
        <div className="relative bg-gray-50 h-36 sm:h-48 md:h-52 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 p-2"
            />
          ) : (
            <div className="text-4xl">🛒</div>
          )}
        </div>

        <div className="p-2 sm:p-3 md:p-4 pb-0 flex-1 flex flex-col">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 truncate">
            {product.brand?.name || "Thực phẩm"}
          </p>

          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 sm:mb-2 min-h-[32px] sm:min-h-[40px]">
            {product.name}
          </h3>
        </div>
      </Link>

      {reviewCount > 0 && (
        <div className="px-2 sm:px-3 md:px-4 flex items-center gap-1 mb-1 sm:mb-2">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-500">({reviewCount})</span>
        </div>
      )}

      <div className="p-2 sm:p-3 md:p-4 mt-auto">
        {hasDiscount ? (
          <div className="flex flex-col gap-0.5 sm:gap-1 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              {price.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-sm sm:text-base font-bold text-red-600">
              {Math.round(finalPrice).toLocaleString("vi-VN")}₫
            </span>
          </div>
        ) : (
          <span className="text-sm sm:text-base font-bold text-emerald-700 mb-2 sm:mb-3 block">
            {finalPrice.toLocaleString("vi-VN")}₫
          </span>
        )}

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-1.5 sm:py-2 rounded-lg transition flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Thêm giỏ hàng</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
