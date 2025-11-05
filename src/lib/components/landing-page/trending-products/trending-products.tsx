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
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Trending Products
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.slice(0, 8).map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 group overflow-hidden"
            >
              <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                Trending
              </span>

              <button
                onClick={(e) => e.preventDefault()}
                className="absolute top-3 right-3 bg-white p-2 rounded-full hover:bg-red-50 transition z-10"
              >
                <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition" />
              </button>

              <div className="relative w-full h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🍎
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-500 mb-1">
                  {product.brand?.name || "Fresh Produce"}
                </p>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price ? Number(product.price).toFixed(2) : "0.00"}
                  </span>

                  <button
                    onClick={(e) => handleAddToCart(e, product.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {products?.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No trending products available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
