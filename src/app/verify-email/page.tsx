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
      return;
    }

    setLoading(true);
    try {
      const verifyResult = await otpService.verifyOtp(email, otp);

      if (!verifyResult.valid) {
        setError("Invalid or expired OTP");
        setLoading(false);
        return;
      }
      await otpService.register({ email, name, password, phone, otp });
      toast.success("Đăng ký thành công!");
      localStorage.clear();
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await otpService.sendOtp(email);
      alert("📨 OTP sent again!");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
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
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={`w-full h-12 px-4 rounded-xl border ${error ? "border-red-300" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-brand`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-brand text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-brand font-medium hover:text-emerald-600"
              >
                Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
