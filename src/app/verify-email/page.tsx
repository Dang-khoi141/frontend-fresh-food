"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { otpService } from "../../lib/service/otp.service";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") || "" : "";
  const name =
    typeof window !== "undefined" ? localStorage.getItem("name") || "" : "";
  const password =
    typeof window !== "undefined" ? localStorage.getItem("password") || "" : "";
  const phone =
    typeof window !== "undefined" ? localStorage.getItem("phone") || "" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be a 6-digit number");
      toast.error("Mã OTP phải là 6 chữ số!");
      return;
    }

    setLoading(true);
    try {
      const verifyResult = await otpService.verifyOtp(email, otp);

      if (!verifyResult.valid) {
        setError("OTP không đúng hoặc đã hết hạn");
        toast.error("Mã OTP không đúng hoặc đã hết hạn!");
        setLoading(false);
        return;
      }

      await otpService.register({ email, name, password, phone, otp });
      toast.success("Đăng ký thành công!");
      localStorage.clear();

      setTimeout(() => {
        router.push("./login");
      }, 1500);
    } catch (err: any) {
      let errorMessage = "Xác minh OTP thất bại";

      if (err.message) {
        if (err.message.toLowerCase().includes("invalid") ||
          err.message.toLowerCase().includes("expired") ||
          err.message.toLowerCase().includes("wrong")) {
          errorMessage = "Mã OTP không đúng hoặc đã hết hạn";
        } else if (err.message.toLowerCase().includes("network") ||
          err.message.toLowerCase().includes("connection")) {
          errorMessage = "Lỗi kết nối mạng";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;

    setResending(true);
    setError("");

    try {
      await otpService.sendOtp(email);
      toast.success("Đã gửi lại mã OTP thành công! Vui lòng kiểm tra email.");
      setOtp("");
    } catch (err: any) {
      const errorMessage = err.message || "Không thể gửi lại OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2 text-h2_simple_box font-semibold">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-base">
              We sent a code to <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={`w-full h-12 px-4 rounded-xl border ${error ? "border-red-300" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-brand text-center text-2xl tracking-widest`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full h-12 bg-brand text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Đang xác minh..." : "Verify OTP"}
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-brand font-medium hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? "Đang gửi lại..." : "Resend Code"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
