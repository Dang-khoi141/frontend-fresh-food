import { BaseApiService } from "./baseApi.service";

class OtpService extends BaseApiService {
  constructor() {
    super();
  }

  async sendOtp(email: string): Promise<{ message: string; otp?: string }> {
    try {
      return await this.axiosInstance
        .post("/otp", { email })
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
}

export const otpService = new OtpService();
