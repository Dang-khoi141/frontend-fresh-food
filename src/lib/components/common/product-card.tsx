"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    if (!session) {
      router.push("/login");
      return;
    }
    if (product.id) {
      await addToCart(product.id, 1);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition overflow-hidden group flex flex-col cursor-pointer">
        <div className="relative bg-gray-50 h-44 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full object-contain group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="text-5xl">🍎</div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <p className="text-xs text-gray-500 mb-1 truncate">
            {product.brand?.name || "Uncategorized"}
          </p>

          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 h-[38px] leading-tight">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-base font-bold text-emerald-700">
              ${Number(product.price).toFixed(2)}
            </span>

            <button
              onClick={handleAddToCart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-md transition"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-auto flex items-center gap-1 text-xs pt-2">
            <div className="flex items-center bg-emerald-600 text-white px-2 py-0.5 rounded gap-1">
              <span>4.5</span>
              <Star className="h-3 w-3 fill-white" />
            </div>
            <span className="text-gray-500">(7)</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
