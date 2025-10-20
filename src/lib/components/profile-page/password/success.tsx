"use client";

export function Success() {
    return (
        <div className="text-center py-8">
            <div className="mb-4">
                <svg
                    className="w-16 h-16 text-green-500 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Đổi mật khẩu thành công!
            </h3>
            <p className="text-gray-600">
                Mật khẩu của bạn đã được cập nhật
            </p>
        </div>
    );
}
