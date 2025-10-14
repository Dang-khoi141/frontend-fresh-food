"use client";

export default function ProductReview({ productId }: { productId: string }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đánh giá sản phẩm
            </h3>
            <p className="text-gray-600 text-sm">
                Hiện tại chưa có đánh giá nào cho sản phẩm này.
            </p>
            {/* Sau này bạn có thể thêm form: input + star rating + submit */}
        </div>
    );
}
