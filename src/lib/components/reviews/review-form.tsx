"use client";

import { useState, useEffect } from "react";
import { useReview } from "../../hooks/useReview";
import { ReviewModalProps } from "../../interface/review";

export default function ReviewModal({
    productId,
    productName,
    productImage,
    existingReview,
    onClose,
    onSuccess,
}: ReviewModalProps) {
    const { createReview, updateReview } = useReview(productId);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!existingReview;

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || "");
        }
    }, [existingReview]);

    const validateForm = (): boolean => {
        if (rating < 1 || rating > 5) {
            setError("Vui lòng chọn số sao đánh giá từ 1-5");
            return false;
        }
        if (comment.trim().length > 1000) {
            setError("Nhận xét không được quá 1000 ký tự");
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let reviewData;

            if (isEditMode && existingReview?.id) {
                await updateReview(existingReview.id, { rating, comment: comment.trim() });
                reviewData = {
                    ...existingReview,
                    rating,
                    comment: comment.trim(),
                    productId,
                };
                alert("Cập nhật đánh giá thành công! 🎉");
            } else {
                const result = await createReview({ rating, comment: comment.trim() });
                reviewData = {
                    rating,
                    comment: comment.trim(),
                    productId,
                    ...result,
                };
                alert("Cảm ơn bạn đã đánh giá sản phẩm! 🎉");
            }

            if (onSuccess) {
                onSuccess(reviewData);
            }

            onClose();
        } catch (error: any) {
            console.error("Review submission error:", error);

            let errorMessage = "Không thể gửi đánh giá. Vui lòng thử lại.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [loading, onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? "Cập nhật đánh giá" : "Đánh giá sản phẩm"}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none p-1 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 border-b border-gray-100">
                    <div className="flex gap-4 p-4 bg-gradient-to-br from-emerald-50 to-gray-50 rounded-xl">
                        <img
                            src={productImage || "/placeholder.png"}
                            alt={productName}
                            className="w-20 h-20 object-contain border border-gray-200 rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 line-clamp-2 mb-2">
                                {productName}
                            </p>
                            <p className="text-sm text-emerald-600 flex items-center gap-1">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Đã mua hàng
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 flex-1">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            Đánh giá của bạn <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3 justify-center py-4 bg-gray-50 rounded-xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    disabled={loading}
                                    className="text-5xl transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label={`${star} sao`}
                                >
                                    {star <= (hoveredRating || rating) ? (
                                        <span className="text-yellow-400 drop-shadow-md">★</span>
                                    ) : (
                                        <span className="text-gray-300">★</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-sm font-medium text-gray-700 mt-2">
                            {rating === 5 && "🌟 Tuyệt vời!"}
                            {rating === 4 && "👍 Rất tốt!"}
                            {rating === 3 && "😊 Bình thường"}
                            {rating === 2 && "😕 Tạm được"}
                            {rating === 1 && "😞 Chưa hài lòng"}
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Nhận xét của bạn
                            <span className="text-gray-400 font-normal text-sm ml-2">
                                ({comment.length}/1000)
                            </span>
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            maxLength={1000}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading || rating < 1}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {isEditMode ? "Đang cập nhật..." : "Đang gửi..."}
                                </span>
                            ) : (
                                isEditMode ? "Cập nhật" : "Gửi đánh giá"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}