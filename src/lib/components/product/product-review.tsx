"use client";

import { useEffect, useState } from "react";
import { useReview } from "../../hooks/useReview";
import { IReview } from "../../interface/review";
import Image from "next/image";

export default function ProductReview({ productId }: { productId: string }) {
    const { reviews, loading, fetchReviews } = useReview(productId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                setError(null);
                await fetchReviews();
            } catch (err) {
                console.error("Failed to load reviews:", err);
                setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
            }
        };
        loadReviews();
    }, [fetchReviews]);

    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : "0.0";

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        percentage:
            reviews.length > 0
                ? ((reviews.filter((r) => r.rating === star).length / reviews.length) * 100).toFixed(0)
                : "0",
    }));

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 shadow-sm border border-emerald-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex items-center justify-center lg:justify-start gap-6">
                        <div className="text-center">
                            <div className="text-5xl lg:text-6xl font-bold text-emerald-600 mb-2">
                                {avgRating}
                            </div>
                            <div className="flex items-center justify-center gap-1 text-yellow-500 text-xl lg:text-2xl mb-2">
                                {renderStars(Number(avgRating))}
                            </div>
                            <div className="text-sm text-gray-600">
                                {reviews.length} đánh giá
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {ratingDistribution.map((item) => (
                            <div key={item.star} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16 text-sm text-gray-600">
                                    <span>{item.star}</span>
                                    <span className="text-yellow-500">★</span>
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right font-medium">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                        Đánh giá từ khách hàng
                    </h3>
                    {reviews.length > 0 && (
                        <span className="text-sm text-gray-500">
                            {reviews.length} đánh giá
                        </span>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchReviews();
                            }}
                            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {loading && !error && (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải đánh giá...</p>
                    </div>
                )}

                {!loading && !error && reviews.length === 0 && (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-700 text-lg font-medium mb-2">
                            Chưa có đánh giá nào
                        </p>
                        <p className="text-gray-500 text-sm">
                            Hãy mua sản phẩm và trở thành người đánh giá đầu tiên!
                        </p>
                    </div>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReviewItem({ review }: { review: IReview }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                    {review.user?.avatar ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-emerald-100 shadow-md">
                            <Image
                                src={review.user.avatar}
                                alt={review.user.name || "User"}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {review.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 text-base truncate">
                            {review.user?.name || "Khách hàng"}
                        </span>
                        {review.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full whitespace-nowrap">
                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Đã mua hàng
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <div className="flex items-center gap-1 text-yellow-500">
                            {renderStars(review.rating)}
                        </div>
                        {review.createdAt && (
                            <>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">
                                    {formatDate(review.createdAt)}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {review.comment && (
                <p className="text-gray-700 leading-relaxed pl-16">
                    {review.comment}
                </p>
            )}
        </div>
    );
}

function renderStars(rating: number) {
    return (
        <>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">
                    {star <= rating ? "★" : "☆"}
                </span>
            ))}
        </>
    );
}

function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hôm nay";
        if (diffDays === 1) return "Hôm qua";
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;

        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch {
        return "Không rõ";
    }
}
