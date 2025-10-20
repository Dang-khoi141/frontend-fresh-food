import { UserProfile } from "../interface/user";
import { BaseApiService } from "./baseApi.service";

class UserService extends BaseApiService {
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

  async updateProfile(
    id: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const res = await this.axiosInstance.patch(`/users/me/${id}`, data);
      return res.data?.data ?? res.data;
    } catch (error: any) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async uploadAvatar(id: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await this.axiosInstance.post(
        `/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadRes.data?.data?.imageUrl;

      if (!imageUrl) {
        throw new Error("No imageUrl returned from server");
      }

      await this.updateProfile(id, { avatar: imageUrl });

      return imageUrl;
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
