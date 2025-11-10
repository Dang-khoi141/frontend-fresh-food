"use client";

import { SendOtpStepProps } from "../../../interface/user";

export function SendOtp({ userEmail, loading, error, onSendOtp }: SendOtpStepProps) {
    return (
        <div className="space-y-5 sm:space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                    <svg
                        className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                            Xác thực tài khoản
                        </p>
                        <p className="text-xs sm:text-sm text-blue-700 break-words">
                            Để bảo mật tài khoản, chúng tôi sẽ gửi mã xác thực đến email{" "}
                            <span className="font-semibold break-all">{userEmail}</span>
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
                    {error}
                </div>
            )}

            <button
                onClick={onSendOtp}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Đang gửi..." : "Gửi mã xác thực"}
            </button>
        </div>
    );
}
