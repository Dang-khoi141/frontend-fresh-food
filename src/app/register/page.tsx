"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { otpService } from "../../lib/service/otp.service";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10-11 digits";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      localStorage.setItem("name", formData.name);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("password", formData.password);
      localStorage.setItem("phone", formData.phone);

      await otpService.sendOtp(formData.email);

      router.push("/verify-email");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        email: err.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2 text-h2_simple_box font-semibold">
              Create Account
            </h1>
            <p className="text-gray-600 text-base">
              Join FreshMart for fresh groceries delivered
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full h-12 px-4 rounded-xl border ${
                  errors.name ? "border-red-300" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-brand`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full h-12 px-4 rounded-xl border ${
                  errors.email ? "border-red-300" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-brand`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+84 123 456 789"
                className={`w-full h-12 px-4 rounded-xl border ${
                  errors.phone ? "border-red-300" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-brand`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full h-12 px-4 pr-12 rounded-xl border ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full h-12 px-4 pr-12 rounded-xl border ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-brand`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-brand text-white font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Create Account"}
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-brand font-semibold hover:text-emerald-600"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
