"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ChangePasswordProps } from "../../../interface/user";
import { otpService } from "../../../service/otp.service";
import { InputPassword } from "./input-password";
import { SendOtp } from "./send-otp";
import { Success } from "./success";
import { VerifyOtp } from "./verify-otp";

export default function ChangePassword({ userEmail }: ChangePasswordProps) {
    const [showSendOtp, setShowSendOtp] = useState(true);
    const [showVerifyOtp, setShowVerifyOtp] = useState(false);
    const [showInputPassword, setShowInputPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [otp, setOtp] = useState("");
    const [verifiedOtp, setVerifiedOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return "Mật khẩu phải có ít nhất 8 ký tự";
        }
        if (!/[A-Z]/.test(password)) {
            return "Mật khẩu phải có ít nhất 1 chữ hoa";
        }
        if (!/[a-z]/.test(password)) {
            return "Mật khẩu phải có ít nhất 1 chữ thường";
        }
        if (!/[0-9]/.test(password)) {
            return "Mật khẩu phải có ít nhất 1 chữ số";
        }
        return "";
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resetForm = () => {
        setShowSendOtp(true);
        setShowVerifyOtp(false);
        setShowInputPassword(false);
        setShowSuccess(false);
        setOtp("");
        setVerifiedOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setCountdown(0);
    };

    const handleSendOtp = async () => {
        setError("");
        setLoading(true);

        try {
            await otpService.sendForgotOtp(userEmail);
            toast.success("Mã OTP đã được gửi đến email của bạn");
            setShowSendOtp(false);
            setShowVerifyOtp(true);
            startCountdown();
        } catch (err: any) {
            setError(err.message || "Không thể gửi mã OTP");
            toast.error(err.message || "Không thể gửi mã OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Mã OTP phải là 6 chữ số");
            return;
        }

        setLoading(true);
        try {
            const verifyResult = await otpService.verifyOtp(userEmail, otp);

            if (!verifyResult.valid) {
                setError("Mã OTP không đúng");
                toast.error("Mã OTP không đúng");
                setLoading(false);
                return;
            }

            toast.success("Xác thực thành công!");
            setVerifiedOtp(otp);
            setShowVerifyOtp(false);
            setShowInputPassword(true);
        } catch (err: any) {
            setError(err.message || "Xác thực OTP thất bại");
            toast.error(err.message || "Xác thực OTP thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới không khớp");
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);
        try {
            await otpService.resetPassword({
                email: userEmail,
                otp: verifiedOtp,
                newPassword: newPassword,
            });

            toast.success("Đổi mật khẩu thành công!");
            setShowInputPassword(false);
            setShowSuccess(true);

            setTimeout(() => {
                resetForm();
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Đổi mật khẩu thất bại");
            toast.error(err.message || "Đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            await otpService.sendForgotOtp(userEmail);
            toast.success("Mã OTP mới đã được gửi!");
            startCountdown();
            setOtp("");
            setError("");
        } catch (err: any) {
            toast.error(err.message || "Không thể gửi lại mã OTP");
        }
    };

    const handleBackFromVerify = () => {
        setShowVerifyOtp(false);
        setShowSendOtp(true);
        setOtp("");
        setError("");
        setCountdown(0);
    };

    const handleBackFromPassword = () => {
        setShowInputPassword(false);
        setShowVerifyOtp(true);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6">
                Đổi Mật Khẩu
            </h2>

            {showSendOtp && (
                <SendOtp
                    userEmail={userEmail}
                    loading={loading}
                    error={error}
                    onSendOtp={handleSendOtp}
                />
            )}

            {showVerifyOtp && (
                <VerifyOtp
                    userEmail={userEmail}
                    otp={otp}
                    loading={loading}
                    error={error}
                    countdown={countdown}
                    onOtpChange={setOtp}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                    onBack={handleBackFromVerify}
                />
            )}

            {showInputPassword && (
                <InputPassword
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    loading={loading}
                    error={error}
                    onNewPasswordChange={setNewPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    onSubmit={handleChangePassword}
                    onBack={handleBackFromPassword}
                />
            )}

            {showSuccess && <Success />}
        </div>
    );
}
