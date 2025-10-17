"use client";

import { useCart } from "@/contexts/cart-context";
import { Product } from "@/lib/interface/product";
import { productService } from "@/lib/service/product.service";
import {
  ChevronDown,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import { useAddressContext } from "../../../../contexts/address-context";
import { useFetchAddress } from "../../../hooks/useFetchAddress";
import CartDrawer from "../../common/cart-drawer";

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
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);
  const { data: session } = isAuthPage ? { data: null } : useSession();
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
    getDisplayAddress,
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
    if (success) setOpenAddressModal(false);
  };

  const handleCloseModal = () => {
    setOpenAddressModal(false);
    resetForm();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <header className="w-full fixed z-30 top-0 bg-white shadow-md">
      <div className="w-full bg-emerald-600 text-white text-xs md:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <p>Miễn phí giao hàng tại TP.HCM</p>
          <p>
            Hotline: 1900-1234 <span className="px-2">|</span> Theo dõi đơn hàng
          </p>
        </div>
      </div>

      <div className="w-full bg-white">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-4 gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-2xl shadow-lg">
              F
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              FreshMart
            </span>
          </Link>

          <div className="hidden md:block relative flex-shrink-0" ref={locationRef}>
            <button
              onClick={(e) => {
                if (session) handleOpenLocation(e);
                else router.push("/login");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition"
            >
              <MapPin className="h-5 w-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Giao hàng đến</p>
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  {session
                    ? defaultAddress
                      ? defaultAddress.line1
                      : "Nhấn để chọn vị trí"
                    : "Nhấn để chọn vị trí"}
                  <ChevronDown className="h-4 w-4" />
                </p>
              </div>
            </button>

            {openLocationMenu && session && (
              <div className="absolute top-full mt-2 left-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-lg">Địa chỉ giao hàng</p>
                  <button
                    onClick={() => {
                      setOpenAddressModal(true);
                      setOpenLocationMenu(false);
                    }}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                  >
                    <Plus className="h-4 w-4" /> Thêm mới
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto p-2">
                  {addresses.length === 0 ? (
                    <div className="p-8 text-center">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">Chưa có địa chỉ nào</p>
                      <button
                        onClick={() => {
                          setOpenAddressModal(true);
                          setOpenLocationMenu(false);
                        }}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                      >
                        Thêm địa chỉ mới
                      </button>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 mb-2 rounded-lg border-2 cursor-pointer transition ${address.isDefault
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="flex-1"
                            onClick={async () => {
                              if (updatingDefault) return;
                              setUpdatingDefault(true);
                              try {
                                await setAsDefaultAddress(address.id);
                                await refreshAddress();
                              } finally {
                                setUpdatingDefault(false);
                                setOpenLocationMenu(false);
                              }
                            }}

                          >
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                              {address.isDefault && (
                                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900">{address.line1}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.postalCode && `${address.postalCode}, `}
                              {address.city}, {address.province}
                            </p>
                          </div>
                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAddress(address.id);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 relative max-w-2xl" ref={searchRef}>
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

          <nav className="hidden md:flex items-center gap-6">
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
                      href="/profile-page"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-md"
                      onClick={() => setOpenMenu(false)}
                    >
                      <User className="h-5 w-5 text-emerald-600" /> Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-md"
                      onClick={() => setOpenMenu(false)}
                    >
                      <Package className="h-5 w-5 text-emerald-600" /> Đơn hàng đã mua
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 rounded-md text-red-600"
                    >
                      <LogOut className="h-5 w-5" /> Đăng xuất
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

      {/* Add Address Modal */}
      {openAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Thêm địa chỉ mới</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  value={addressForm.provinceCode || ""}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  disabled={loadingProvinces}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-emerald-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingProvinces ? "Đang tải..." : "Chọn Tỉnh/Thành phố"}
                  </option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quận/Huyện <span className="text-red-500">*</span>
                </label>
                <select
                  value={addressForm.districtCode || ""}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!addressForm.provinceCode || loadingDistricts}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-emerald-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingDistricts
                      ? "Đang tải..."
                      : addressForm.provinceCode
                        ? "Chọn Quận/Huyện"
                        : "Vui lòng chọn Tỉnh/Thành phố trước"}
                  </option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <select
                  value={addressForm.wardCode || ""}
                  onChange={(e) => handleWardChange(e.target.value)}
                  disabled={!addressForm.districtCode || loadingWards}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-emerald-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingWards
                      ? "Đang tải..."
                      : addressForm.districtCode
                        ? "Chọn Phường/Xã"
                        : "Vui lòng chọn Quận/Huyện trước"}
                  </option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={addressForm.line1}
                  onChange={(e) => updateFormField("line1", e.target.value)}
                  placeholder="Số nhà, tên đường..."
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-emerald-500 outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => updateFormField("isDefault", e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateAddress}
                  disabled={loadingAddress}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
};

export default memo(FreshNav);
