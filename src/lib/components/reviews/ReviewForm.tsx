"use client";

import { useState } from "react";
import { useReview } from "../../hooks/useReview";

interface ReviewFormProps {
    productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
    const { createReview } = useReview(productId);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createReview({ rating, comment });
            setSuccess(true);
            setComment("");
            setRating(5);
        } catch (error) {
            alert("Không thể gửi đánh giá. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border rounded-lg p-6 shadow-md mt-8">
            <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>

            {success && (
                <div className="text-green-600 mb-3">🎉 Cảm ơn bạn đã đánh giá sản phẩm!</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Đánh giá sao:</label>
                    <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                                {r} sao
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Nhận xét:</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
                >
                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </form>
        </div>
    );
}
