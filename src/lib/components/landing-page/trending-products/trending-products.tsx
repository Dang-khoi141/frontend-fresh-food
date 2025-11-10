"use client";

import { useCart } from "@/contexts/cart-context";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useFetchProducts from "../../../hooks/useFetchProducts";

const TrendingProducts = () => {
  const { products, loading, error, fetchProducts } = useFetchProducts();
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Loading products...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-red-600 text-sm sm:text-base">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center sm:text-left w-full sm:w-auto">
            Trending Products
          </h2>
        </div>

        {/* Grid sản phẩm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products?.slice(0, 8).map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1.5 sm:hover:-translate-y-2 group overflow-hidden"
            >
              {/* Badge Trending */}
              <span className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-emerald-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
                Trending
              </span>

              {/* Nút yêu thích */}
              <button
                onClick={(e) => e.preventDefault()}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white p-1.5 sm:p-2 rounded-full hover:bg-red-50 transition z-10"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-red-500 transition" />
              </button>

              {/* Ảnh sản phẩm */}
              <div className="relative w-full h-40 sm:h-56 md:h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl">
                    🍎
                  </div>
                )}
              </div>

              {/* Nội dung */}
              <div className="p-3 sm:p-5">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                  {product.brand?.name || "Fresh Produce"}
                </p>

                <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    ${product.price ? Number(product.price).toFixed(2) : "0.00"}
                  </span>

                  <button
                    onClick={(e) => handleAddToCart(e, product.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 sm:p-2 rounded-lg transition"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {products?.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-sm sm:text-base">
              No trending products available.
            </div>
          )}
        </div>

        {/* Gợi ý cho mobile */}
        <div className="sm:hidden flex justify-center mt-6">
          <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Vuốt để xem thêm sản phẩm
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
