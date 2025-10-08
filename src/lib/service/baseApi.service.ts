import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

export abstract class BaseApiService {
  protected axiosInstance: AxiosInstance;
  protected baseUrl: string;

  constructor() {
    this.baseUrl = this.getBaseUrl();
    this.axiosInstance = this.createAxiosInstance();
  }

  private getBaseUrl(): string {
    const NEST_API = process.env.NEXT_PUBLIC_API_URL;
    if (!NEST_API) {
      throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
    }
    return NEST_API;
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(
      async config => {
        const session = await getSession();
        const token = session?.accessToken;

        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return instance;
  }

  protected async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(
        endpoint,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  protected async getBinary(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ArrayBuffer> {
    try {
      const response: AxiosResponse<ArrayBuffer> = await this.axiosInstance.get(
        endpoint,
        { responseType: "arraybuffer", ...config }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
