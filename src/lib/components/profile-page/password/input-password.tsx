"use client";

import { InputPasswordStepProps } from "../../../interface/user";

export function InputPassword({
    newPassword,
    confirmPassword,
    loading,
    error,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    onBack,
}: InputPasswordStepProps) {
    return (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-sm font-medium text-green-800">
                        Xác thực thành công! Bây giờ bạn có thể đổi mật khẩu mới
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => onNewPasswordChange(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => onConfirmPasswordChange(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

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
                        disabled={loading}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                </div>
            </form>
        </div>
    );
}
