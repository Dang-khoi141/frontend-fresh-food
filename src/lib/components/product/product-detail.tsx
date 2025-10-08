"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/lib/interface/product";
import { productService } from "../../service/product.service";

import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import AddToCart from "./add-to-cart";
import RelatedProducts from "./related-products";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id as string);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500">
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery image={product.image} name={product.name} />
        <div className="flex flex-col space-y-6">
          <ProductInfo product={product} />
          <AddToCart product={product} />
        </div>
      </div>

      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default ProductDetail;
