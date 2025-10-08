"use client";

import { Heart, LogOut, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import CartDrawer from "../../common/cart-drawer";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const FreshNav = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
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

          <div className="hidden flex-1 px-8 md:block">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-md border border-gray-200">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  aria-label="Search"
                  placeholder="Search for fresh produce, meat, dairy..."
                  className="w-full bg-transparent text-gray-700 outline-none placeholder-gray-400"
                />
              </div>
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
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
};

export default FreshNav;
