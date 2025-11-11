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
        <div className="space-y-5 sm:space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800 break-words">
                    Mã xác thực đã được gửi đến email:{" "}
                    <span className="font-semibold break-all">{userEmail}</span>
                </p>
            </div>

            <form onSubmit={onVerify} className="space-y-5 sm:space-y-6">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Mã OTP
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Nhập mã OTP 6 chữ số"
                        maxLength={6}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-center text-xl sm:text-2xl tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-center sm:justify-between text-xs sm:text-sm">
                    <button
                        type="button"
                        onClick={onResend}
                        disabled={countdown > 0}
                        className={`font-medium ${countdown > 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-emerald-600 hover:text-emerald-700 active:text-emerald-800"
                            }`}
                    >
                        {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã OTP"}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 active:bg-gray-100 transition"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full sm:flex-1 bg-emerald-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang xác thực..." : "Xác nhận"}
                    </button>
                </div>
            </form>
        </div>
    );
}
