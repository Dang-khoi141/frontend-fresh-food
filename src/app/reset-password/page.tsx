"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { otpService } from "../../lib/service/otp.service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("resetEmail") || "" : "";
  const otp =
    typeof window !== "undefined" ? localStorage.getItem("resetOtp") || "" : "";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await otpService.resetPassword({ email, otp, newPassword });

      localStorage.clear();

      alert("✅ Reset password thành công, vui lòng đăng nhập lại");

      router.replace("/login");
    } catch (err: any) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border rounded w-full p-2 mb-3"
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full bg-brand text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
