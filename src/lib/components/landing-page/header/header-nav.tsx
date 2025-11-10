"use client";

import { productService } from "@/lib/service/product.service";
import {
  Heart,
  Search,
  ShoppingCart,
  User,
  X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import { useAddressContext } from "../../../../contexts/address-context";
import { useCart } from "../../../../contexts/cart-context";
import { useFetchAddress } from "../../../hooks/useFetchAddress";
import { Product } from "../../../interface/product";
import CartDrawer from "../../common/cart-drawer";
import AddressFormModal from "../../profile-page/address/address-from-model";

const FreshNav = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openLocationMenu, setOpenLocationMenu] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [updatingDefault, setUpdatingDefault] = useState(false);

  const pathname = usePathname();
  const { data: rawSession } = useSession();
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);
  const session = isAuthPage ? null : rawSession;
  const { defaultAddress, refreshAddress } = useAddressContext();

  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const router = useRouter();

  const {
    addresses,
    loadingAddress,
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    addressForm,
    loadProvinces,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    updateFormField,
    createAddress,
    setAsDefaultAddress,
    deleteAddress,
    resetForm,
  } = useFetchAddress(!!session);

  useEffect(() => {
    if (openAddressModal) loadProvinces();
  }, [openAddressModal, loadProvinces]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) performSearch(searchQuery);
      else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node))
        setShowSearchResults(false);
      if (locationRef.current && !locationRef.current.contains(event.target as Node))
        setOpenLocationMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await productService.searchProducts({ search: query, limit: 5 });
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

  const handleCartClick = () => {
    if (!session) router.push("/login");
    else setOpenCart(true);
  };

  const handleOpenLocation = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!session) {
      if (pathname !== "/login") {
        router.push("/login");
      }
      return;
    }

    setOpenLocationMenu((prev) => !prev);
  };

  const handleLogout = () => signOut({ callbackUrl: "/" });

  const handleCreateAddress = async () => {
    const success = await createAddress();
    if (success) {
      setOpenAddressModal(false);
      await refreshAddress();
    }
  };

  const handleCloseModal = () => {
    setOpenAddressModal(false);
    resetForm();
  };

  const handleSetDefault = async (addressId: string) => {
    if (updatingDefault) return;
    setUpdatingDefault(true);
    try {
      await setAsDefaultAddress(addressId);
      setOpenLocationMenu(false);
    } finally {
      setUpdatingDefault(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    await deleteAddress(addressId);
    await refreshAddress();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <header className="w-full fixed z-30 top-0 bg-white shadow-md">
      {/* Top banner - ẩn trên mobile */}
      <div className="w-full bg-emerald-600 text-white text-xs md:text-sm hidden sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Miễn phí giao hàng tại TP.HCM</p>
          <p>
            Hotline: 1900-1234 <span className="px-2">|</span> Theo dõi đơn hàng
          </p>
        </div>
      </div>

      {/* Navbar chính */}
      <div className="w-full bg-white">
        <div
          className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4 gap-6 flex-wrap sm:flex-nowrap"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center sm:justify-start"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-2xl shadow-lg">
              F
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              FreshMart
            </span>
          </Link>

          {/* Search bar */}
          <div
            className="flex-1 relative max-w-2xl w-full sm:w-auto order-3 sm:order-none mt-3 sm:mt-0"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 border-2 border-gray-200 focus-within:border-emerald-500 transition">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm tươi sống, thực phẩm..."
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
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-3xl">
                                🎁
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {product.brand?.name || "Sản phẩm tươi"}
                            </p>
                            <p className="text-emerald-600 font-bold mt-1">
                              {Number(product.price).toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 border-t text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                      >
                        Xem tất cả kết quả cho "{searchQuery}" →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-600">Không tìm thấy sản phẩm</div>
                )}
              </div>
            )}
          </div>

          {/* Location (ẩn trên mobile) */}
          <div className="hidden md:block relative flex-shrink-0" ref={locationRef}>
            {/* giữ nguyên code location */}
          </div>

          {/* Navigation icons */}
          <nav className="flex items-center gap-6 order-2 sm:order-none w-full sm:w-auto justify-center sm:justify-end">
            <button aria-label="Wishlist" className="hover:text-emerald-600 transition">
              <Heart className="h-6 w-6" />
            </button>
            <button
              aria-label="Cart"
              className="hover:text-emerald-600 transition relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cart.length}
                </span>
              )}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setOpenMenu((prev) => !prev)}
                  className="hover:text-emerald-600 transition"
                >
                  <User className="h-6 w-6" />
                </button>
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-lg border p-2 text-sm">
                    <Link
                      href="/profile-page?tab=profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-md"
                      onClick={() => setOpenMenu(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/profile-page?tab=orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-md"
                      onClick={() => setOpenMenu(false)}
                    >
                      Đơn hàng đã mua
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 rounded-md text-red-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-emerald-600 transition">
                <User className="h-6 w-6" />
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Modals giữ nguyên */}
      <AddressFormModal
        isOpen={openAddressModal}
        onClose={handleCloseModal}
        addressForm={addressForm}
        provinces={provinces}
        districts={districts}
        wards={wards}
        loadingProvinces={loadingProvinces}
        loadingDistricts={loadingDistricts}
        loadingWards={loadingWards}
        onProvinceChange={handleProvinceChange}
        onDistrictChange={handleDistrictChange}
        onWardChange={handleWardChange}
        onFieldChange={updateFormField}
        onSubmit={handleCreateAddress}
        isLoading={loadingAddress}
      />

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
};

export default memo(FreshNav);
