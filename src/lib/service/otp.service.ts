import { BaseApiService } from "./baseApi.service";

class OtpService extends BaseApiService {
  constructor() {
    super();
  }

  async sendOtp(email: string): Promise<{ message: string; otp?: string }> {
    try {
      return await this.axiosInstance
        .post("/otp/register", { email })
        .then(res => res.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Không thể gửi OTP");
    }
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    otp: string;
  }) {
    try {
      return await this.axiosInstance
        .post("/auth/register", data)
        .then(res => res.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn");
    }
  }

  async sendForgotOtp(email: string): Promise<{ message: string }> {
    try {
      return await this.axiosInstance
        .post("/otp/forgot", { email })
        .then(res => res.data);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Không thể gửi OTP đặt lại mật khẩu"
      );
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ valid: boolean }> {
    try {
      const response = await this.axiosInstance.post("/otp/verify", {
        email,
        otp,
      });

      const isValid = response.data?.data?.valid === true;

      if (!isValid) {
        throw new Error("Mã OTP không đúng hoặc đã hết hạn");
      }

      return { valid: true };
    } catch (error: any) {
      if (error.response?.data?.data?.valid === false) {
        throw new Error("Mã OTP không đúng hoặc đã hết hạn");
      }

      throw new Error(
        error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn"
      );
    }
  }

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    try {
      return await this.axiosInstance
        .post("/otp/reset-password", data)
        .then(res => res.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đặt lại mật khẩu thất bại");
    }
  }
}

export const otpService = new OtpService();