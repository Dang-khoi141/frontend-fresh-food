"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Category, categoryService } from "../../../service/category.service";

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
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Top Categories
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= categories.length}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/categories/${cat.id}`)}
              className="relative cursor-pointer rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition"
            >
              <div className="relative h-48 md:h-56 w-full overflow-hidden">
                <Image
                  src={cat.imageUrl || "/placeholder.png"}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-70 transition"></div>
              </div>

              <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-200">
                  {cat.totalProducts} items
                </p>
              </div>
            </div>
          ))}

          {visibleCategories.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No categories available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
