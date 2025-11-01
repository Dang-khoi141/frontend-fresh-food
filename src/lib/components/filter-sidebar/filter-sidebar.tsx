"use client";

import { X, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Brand } from "@/lib/interface/brands";
import { useState } from "react";

interface FilterSidebarProps {
  brands: Brand[];
  selectedBrand: string;
  priceRange: { min: number; max: number };
  minRating: number;
  onBrandChange: (brandId: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const PRICE_RANGES = [
  { label: "Dưới 50.000đ", min: 0, max: 50000 },
  { label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
  { label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
  { label: "200.000đ - 500.000đ", min: 200000, max: 500000 },
  { label: "Trên 500.000đ", min: 500000, max: 999999999 },
];

const RATINGS = [5, 4, 3, 2, 1];

export default function FilterSidebar({
  brands,
  selectedBrand,
  priceRange,
  minRating,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onClearAll,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    rating: true,
  });

  const toggleSection = (section: "price" | "brand" | "rating") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isPriceRangeSelected = (min: number, max: number) => {
    return priceRange.min === min && priceRange.max === max;
  };

  const hasActiveFilters =
    selectedBrand !== "" ||
    priceRange.min > 0 ||
    priceRange.max < 999999999 ||
    minRating > 0;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto
        w-80 bg-white border-r lg:border-r-0 lg:border border-gray-200
        rounded-none lg:rounded-xl
        overflow-y-auto z-50 lg:z-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg text-gray-900">Bộ lọc</h2>
            {hasActiveFilters && (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                {(selectedBrand !== "" ? 1 : 0) +
                  (priceRange.min > 0 || priceRange.max < 999999999 ? 1 : 0) +
                  (minRating > 0 ? 1 : 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Xóa tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-semibold text-gray-900">Khoảng giá</h3>
              {expandedSections.price ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSections.price && (
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={isPriceRangeSelected(range.min, range.max)}
                      onChange={() => onPriceChange(range.min, range.max)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection("rating")}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-semibold text-gray-900">Đánh giá</h3>
              {expandedSections.rating ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSections.rating && (
              <div className="space-y-2">
                {RATINGS.map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => onRatingChange(rating)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-sm text-gray-700 ml-1 group-hover:text-gray-900">
                        {rating === 5 ? "" : "trở lên"}
                      </span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 0}
                    onChange={() => onRatingChange(0)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Tất cả
                  </span>
                </label>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection("brand")}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="font-semibold text-gray-900">Thương hiệu</h3>
              {expandedSections.brand ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedSections.brand && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {brands.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Không có thương hiệu
                  </p>
                ) : (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === ""}
                        onChange={() => onBrandChange("")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        Tất cả
                      </span>
                    </label>
                    {brands.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="brand"
                          checked={selectedBrand === String(brand.id)}
                          onChange={() => onBrandChange(String(brand.id))}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
