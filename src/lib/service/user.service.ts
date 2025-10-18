import { UserProfile } from "../interface/user";
import { BaseApiService } from "./baseApi.service";

class UserService extends BaseApiService {
  async getUserByEmail(email: string): Promise<UserProfile> {
    try {
      const res = await this.axiosInstance.get(
        `/users/email/${encodeURIComponent(email)}`
      );
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error fetching user by email:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserProfile> {
    try {
      const res = await this.axiosInstance.get(`/users/${id}`);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error fetching user by ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async updateProfile(
    id: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const res = await this.axiosInstance.patch(`/users/${id}`, data);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async uploadAvatar(id: string, file: File): Promise<UserProfile> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await this.axiosInstance.post(
        `/users/${id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error uploading avatar:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export const userService = new UserService();
