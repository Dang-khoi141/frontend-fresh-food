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
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onFilterToggle}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium">Bộ lọc</span>
          </button>
          <p className="text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{totalProducts}</span> sản phẩm
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <ArrowUpDown className="h-4 w-4 text-gray-500 hidden sm:block" />
          <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:block">
            Sắp xếp:
          </span>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${sortBy === option.value
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
