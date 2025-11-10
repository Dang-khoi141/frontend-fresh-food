"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Category } from "../../../interface/category";
import { categoryService } from "../../../service/category.service";

const TopCategories = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    (async () => {
      const data = await categoryService.getTopCategories(8);
      setCategories(data);
    })();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, categories.length - itemsPerPage)
    );
  };

  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center sm:text-left w-full sm:w-auto">
            Top Categories
          </h2>

          {/* Nút điều hướng */}
          <div className="flex justify-center sm:justify-end w-full sm:w-auto gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 sm:p-2.5 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= categories.length}
              className="p-2 sm:p-2.5 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Grid danh mục */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/categories/${cat.id}`)}
              className="relative cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition"
            >
              <div className="relative h-36 sm:h-44 md:h-56 w-full overflow-hidden">
                <Image
                  src={cat.imageUrl || "/placeholder.png"}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition"></div>
              </div>

              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white drop-shadow-md">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200">
                  {cat.totalProducts} items
                </p>
              </div>
            </div>
          ))}

          {visibleCategories.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-sm sm:text-base">
              No categories available.
            </div>
          )}
        </div>

        {/* Gợi ý cho mobile */}
        <div className="sm:hidden flex justify-center mt-6">
          <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Vuốt để xem thêm
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
