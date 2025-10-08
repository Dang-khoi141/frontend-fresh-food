"use client";

export default function ProductInfo({ product }: { product: any }) {
  const hasDiscount = Math.random() > 0.5;
  const discountPrice = hasDiscount ? (product.price * 0.9).toFixed(2) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-500">
        {product.brand?.name} • {product.category?.name}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-emerald-600">
          ${discountPrice || Number(product.price).toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-sm text-gray-400 line-through">
            ${Number(product.price).toFixed(2)}
          </span>
        )}
      </div>

      {product.description && (
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      )}
    </div>
  );
}
