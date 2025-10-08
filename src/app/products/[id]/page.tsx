"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/lib/components/product/product-detail";

export default function ProductDetailPage() {
  const { id } = useParams();

  if (!id || Array.isArray(id)) {
    return <p className="text-center py-10">Invalid product</p>;
  }

  return <ProductDetail id={id} />;
}
