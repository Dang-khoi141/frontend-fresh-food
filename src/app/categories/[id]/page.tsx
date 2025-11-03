"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "../../../lib/components/common/product-card";
import FilterSidebar from "../../../lib/components/filter-sidebar/filter-sidebar";
import Footer from "../../../lib/components/landing-page/footer/footer";
import FreshNav from "../../../lib/components/landing-page/header/header-nav";
import SortBar, { SortOption } from "../../../lib/components/sort-bar/sort-bar";
import useFetchProducts from "../../../lib/hooks/useFetchProducts";
import { Brand } from "../../../lib/interface/brands";
import { Category } from "../../../lib/interface/category";
import { brandService } from "../../../lib/service/brand.service";
import { categoryService } from "../../../lib/service/category.service";

export default function CategoryPage() {
  const { id } = useParams();
  const { products, loading, error, total, searchProducts } = useFetchProducts();
  const [category, setCategory] = useState<Category | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999999 });
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.NEWEST);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadInitialData = async () => {
      try {
        const [cat, brandList] = await Promise.all([
          categoryService.getCategoryById(id as string),
          brandService.getAllBrands(),
        ]);
        setCategory(cat);
        setBrands(brandList);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };
    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const params = {
      categoryId: id as string,
      brandId: selectedBrand || undefined,
      minPrice: priceRange.min > 0 ? priceRange.min : undefined,
      maxPrice: priceRange.max < 999999999 ? priceRange.max : undefined,
      minRating: minRating > 0 ? minRating : undefined,
      sortBy,
      page: 1,
      limit: 20,
    };

    searchProducts(params);
  }, [id, selectedBrand, priceRange, minRating, sortBy]);

  const handleClearFilters = () => {
    setSelectedBrand("");
    setPriceRange({ min: 0, max: 999999999 });
    setMinRating(0);
  };

  const hasActiveFilters =
    selectedBrand !== "" ||
    priceRange.min > 0 ||
    priceRange.max < 999999999 ||
    minRating > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <FreshNav />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-emerald-600">
            Trang chủ
          </Link >
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">
            {category?.name || "Danh mục"}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {category?.name || "Danh mục sản phẩm"}
        </h1>

        <div className="flex gap-6">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                brands={brands}
                selectedBrand={selectedBrand}
                priceRange={priceRange}
                minRating={minRating}
                onBrandChange={setSelectedBrand}
                onPriceChange={(min, max) => setPriceRange({ min, max })}
                onRatingChange={setMinRating}
                onClearAll={handleClearFilters}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>

          <div className="flex-1">
            <SortBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalProducts={total}
              onFilterToggle={() => setIsFilterOpen(true)}
            />

            {hasActiveFilters && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Đang lọc:</span>
                  {selectedBrand && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                      {brands.find((b) => String(b.id) === selectedBrand)?.name}
                    </span>
                  )}
                  {(priceRange.min > 0 || priceRange.max < 999999999) && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                      {priceRange.min.toLocaleString()}đ - {priceRange.max === 999999999 ? "∞" : priceRange.max.toLocaleString() + "đ"}
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                      {minRating}⭐ trở lên
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium ml-2"
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-3 text-gray-600">Đang tải sản phẩm...</span>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">Lỗi tải sản phẩm. Vui lòng thử lại!</p>
              </div>
            )}

            {!loading && !error && (
              <>
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <p className="text-gray-600 text-lg">
                      Không tìm thấy sản phẩm nào phù hợp
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
