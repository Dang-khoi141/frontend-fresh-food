"use client";

import { VerifyOtpStepProps } from "../../../interface/user";

export function VerifyOtp({
    userEmail,
    otp,
    loading,
    error,
    countdown,
    onOtpChange,
    onVerify,
    onResend,
    onBack,
}: VerifyOtpStepProps) {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    Mã xác thực đã được gửi đến email:{" "}
                    <span className="font-semibold">{userEmail}</span>
                </p>
            </div>

            <form onSubmit={onVerify} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã OTP
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Nhập mã OTP 6 chữ số"
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <button
                        type="button"
                        onClick={onResend}
                        disabled={countdown > 0}
                        className={`font-medium ${countdown > 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-emerald-600 hover:text-emerald-700"
                            }`}
                    >
                        {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã OTP"}
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang xác thực..." : "Xác nhận"}
                    </button>
                </div>
            </form>
        </div>
    );
}
