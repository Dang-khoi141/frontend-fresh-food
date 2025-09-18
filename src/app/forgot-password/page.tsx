"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { otpService } from "../../lib/service/otp.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await otpService.sendForgotOtp(email);

      localStorage.setItem("resetEmail", email);

      router.push("/verify-otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded w-full p-2 mb-3"
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full bg-brand text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
}
