"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categoryService } from "@/lib/services/category.service";

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (id) {
      categoryService.getCategory(id, true).then(setCategory);
    }
  }, [id]);

  if (!category) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{category.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {category.products?.map((p) => (
          <div key={p.id} className="border p-3 rounded">
            <p>{p.name}</p>
            <p className="text-sm text-gray-500">{p.price} đ</p>
          </div>
        ))}
      </div>
    </div>
  );
}
