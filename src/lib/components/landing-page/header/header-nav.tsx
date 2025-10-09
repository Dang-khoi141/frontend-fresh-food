"use client";

import { Heart, LogOut, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import CartDrawer from "../../common/cart-drawer";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { productService } from "@/lib/service/product.service";
import { Product } from "@/lib/interface/product";

const FreshNav = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCartClick = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setOpenCart(true);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await productService.searchProducts({
        search: query,
        limit: 5,
      });
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search-result?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <header className="w-full fixed z-30 top-0">
      <div className="w-full bg-emerald-600 text-white text-xs md:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p className="opacity-95">Free delivery in Ho Chi Minh City</p>
          <p className="opacity-95">
            Customer Service: 1900-1234 <span className="px-2">|</span> Track Your Order
          </p>
        </div>
      </div>

      <div className="w-full bg-gradient-to-r from-emerald-50 to-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xl">
                F
              </div>
              <span className="text-xl font-bold text-slate-800">FreshMart</span>
            </div>
          </Link>

          <div className="hidden flex-1 px-8 md:block" ref={searchRef}>
            <div className="mx-auto max-w-2xl relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-md border border-gray-200">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for fresh produce, meat, dairy..."
                    className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </form>

              {showSearchResults && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-6 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
                      <p className="text-gray-600 mt-2 text-sm">Đang tìm kiếm...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b border-gray-100 text-left"
                          >
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                  🍎
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {product.brand?.name || "Fresh Produce"}
                              </p>
                              <p className="text-emerald-600 font-bold mt-1">
                                ${Number(product.price).toFixed(2)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-3 bg-gray-50 border-t">
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full text-center text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                        >
                          Xem tất cả kết quả cho "{searchQuery}" →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-600">Không tìm thấy sản phẩm</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <nav className="ml-6 hidden items-center gap-8 text-slate-700 font-medium md:flex">
            <a className="hover:text-emerald-600 transition" href="/">Home</a>
            <a className="hover:text-emerald-600 transition" href="/shop">Shop</a>
            <a className="hover:text-emerald-600 transition" href="/about">About</a>
            <a className="hover:text-emerald-600 transition" href="/contact">Contact</a>

            <div className="ml-1 flex items-center gap-5 text-slate-700">
              <button aria-label="Wishlist" className="hover:text-emerald-600 transition">
                <Heart className="h-5 w-5" />
              </button>

              <button
                aria-label="Cart"
                className="hover:text-emerald-600 transition relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cart.length}
                  </span>
                )}
              </button>

              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu((prev) => !prev)}
                    aria-label="Account"
                    className="hover:text-emerald-600 transition"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  {openMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border p-2 text-sm">
                      <Link
                        href="/profile-page"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md"
                        onClick={() => setOpenMenu(false)}
                      >
                        <User className="h-4 w-4" /> Hồ sơ cá nhân
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-slate-100 rounded-md"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Account"
                  className="hover:text-emerald-600 transition"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>
          </nav>
        </div>

        <div className="relative pb-4 px-4 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-md border border-gray-200">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
};

export default FreshNav;
