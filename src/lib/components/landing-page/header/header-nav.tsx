import { Heart, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link"; // Thêm import Link

const FreshNav = () => {

  return (
    <header className="w-full fixed z-20">
      <div className="w-full bg-emerald-600 text-white text-xs md:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p className="opacity-95">Free delivery in Ho Chi Minh City</p>
          <p className="opacity-95">
            Customer Service: 1900-1234 <span className="px-2">|</span> Track Your Order
          </p>
        </div>
      </div>

      <div className="w-full bg-bg_nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
         <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer" >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white font-bold">
              F
            </div>
            <span className="text-lg font-semibold text-slate-800 drop-shadow">
              FreshMart
            </span>
          </div>
         </Link>

          <div className="hidden flex-1 px-6 md:block">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md ring-1 ring-white/40 hover:ring-white/60">
                <Search className="h-4 w-4 shrink-0 text-white/90" />
                <input
                  aria-label="Search"
                  placeholder="Search for fresh produce, meat, dairy..."
                  className="w-full bg-transparent placeholder-white/80 text-white outline-none"
                />
              </div>
            </div>
          </div>

          <nav className="ml-6 hidden items-center gap-7 text-slate-800 md:flex">
            <a className="hover:opacity-80" href="#">Categories</a>
            <a className="hover:opacity-80" href="#">Deals</a>
            <a className="hover:opacity-80" href="#">About</a>
            <div className="ml-1 flex items-center gap-4 text-slate-800">
              {/* <button aria-label="Wishlist" className="hover:opacity-80">
                <Heart className="h-5 w-5" />
              </button> */}

                              <Link href="/phone-verify" className="text-blue-600 hover:text-blue-800 underline">
                               <Heart className="h-5 w-5" />
</Link>
              <button aria-label="Cart" className="hover:opacity-80">
                <ShoppingCart className="h-5 w-5" />
              </button>
              <Link href="/login" aria-label="Account" className="hover:opacity-80">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </div>

        <div className="relative -mt-16 h-16 w-full md:hidden">
          <div className="px-4">
            <div className="flex items-center gap-3 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md ring-1 ring-white/40">
              <Search className="h-4 w-4 shrink-0 text-white/90" />
              <input
                aria-label="Search"
                placeholder="Search for fresh produce, meat, dairy..."
                className="w-full bg-transparent placeholder-white/80 text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default FreshNav;
