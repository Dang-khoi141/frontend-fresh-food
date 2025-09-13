"use client";


import { useState } from "react";
import CheckoutPhoneOTP from "../../lib/components/check-phone/checkoutPhoneOTP";

export default function PhoneVerifyPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [userInfo, setUserInfo] = useState<{phone: string, idToken?: string} | null>(null);

  const handleVerified = (phone: string, idToken?: string) => {
    console.log("✅ Xác thực thành công:", { phone, idToken });
    setUserInfo({ phone, idToken });
    setIsVerified(true);

    // Tại đây bạn có thể:
    // 1. Lưu thông tin vào localStorage/sessionStorage
    // 2. Redirect đến trang khác
    // 3. Gọi API backend để lưu thông tin user

    // Ví dụ lưu vào localStorage:
    localStorage.setItem('verified_phone', phone);
    if (idToken) {
      localStorage.setItem('firebase_token', idToken);
    }
  };

  if (isVerified && userInfo) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-xl font-bold text-green-800 mb-2">
            ✅ Xác thực thành công!
          </h2>
          <p className="text-green-700">
            Số điện thoại: <strong>{userInfo.phone}</strong>
          </p>
          <button
            onClick={() => {
              setIsVerified(false);
              setUserInfo(null);
              localStorage.removeItem('verified_phone');
              localStorage.removeItem('firebase_token');
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Xác thực lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Xác thực số điện thoại
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <CheckoutPhoneOTP onVerified={handleVerified} />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>• Nhập số điện thoại theo format quốc tế (+84...)</p>
          <p>• Firebase sẽ gửi mã OTP qua SMS</p>
          <p>• Nhập mã 6 chữ số để xác thực</p>
        </div>
      </div>
    </div>
  );
}
