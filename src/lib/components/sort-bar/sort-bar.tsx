"use client";

import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

export enum SortOption {
  NEWEST = "newest",
  PRICE_ASC = "priceAsc",
  PRICE_DESC = "priceDesc",
  DISCOUNT = "discount",
  RATING = "rating",
}

interface SortBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalProducts: number;
  onFilterToggle: () => void;
}

const SORT_OPTIONS = [
  { value: SortOption.NEWEST, label: "Mới nhất" },
  { value: SortOption.PRICE_ASC, label: "Giá thấp đến cao" },
  { value: SortOption.PRICE_DESC, label: "Giá cao đến thấp" },
  { value: SortOption.DISCOUNT, label: "Khuyến mãi nhiều" },
];

export default function SortBar({
  sortBy,
  onSortChange,
  totalProducts,
  onFilterToggle,
}: SortBarProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="lg:hidden mb-3">
        <button
          onClick={onFilterToggle}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm active:scale-[0.98]"
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-semibold">Bộ lọc</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUpDown className="h-4 w-4 text-gray-500 hidden sm:block" />
          <span className="text-sm font-medium text-gray-700">
            Sắp xếp theo:
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`
                px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap
                transition-all duration-200 flex-shrink-0
                ${sortBy === option.value
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="hidden sm:block text-sm text-gray-600 mt-3 px-1">
        Tìm thấy <span className="font-semibold text-gray-900">{totalProducts}</span> sản phẩm
      </p>
    </div>
  );
}
