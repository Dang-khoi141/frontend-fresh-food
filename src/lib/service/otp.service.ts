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
      throw new Error(error.response?.data?.message || "Failed to send OTP");
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
      throw new Error(error.response?.data?.message || "Failed to register");
    }
  }

  async sendForgotOtp(email: string): Promise<{ message: string }> {
    try {
      return await this.axiosInstance
        .post("/otp/forgot", { email })
        .then(res => res.data);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send OTP for reset"
      );
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ valid: boolean }> {
    try {
      return await this.axiosInstance
        .post("/otp/verify", { email, otp })
        .then(res => {
          if (res.data?.valid !== undefined) {
            return res.data;
          }
          if (res.status === 200 || res.status === 201) {
            return { valid: true };
          }
          return { valid: false };
        });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
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
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  }
}

export const otpService = new OtpService();
