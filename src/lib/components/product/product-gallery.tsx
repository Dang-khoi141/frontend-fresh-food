"use client";
import { useState } from "react";

export default function ProductGallery({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  const [selected] = useState(image);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg flex items-center justify-center h-[400px]">
        {selected ? (
          <img
            src={selected}
            alt={name}
            className="max-h-full object-contain"
          />
        ) : (
          <div className="text-6xl">🍎</div>
        )}
      </div>
    </div>
  );
}
