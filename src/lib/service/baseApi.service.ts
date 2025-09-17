import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export abstract class BaseApiService {
  protected axiosInstance: AxiosInstance;
  protected baseUrl: string;
  constructor() {
    this.baseUrl = this.getBaserUrl();
    this.axiosInstance = this.createAxiosInstance();
  }
  private getBaserUrl(): string {
    const NEST_API = process.env.NEXT_PUBLIC_API_URL;
    return `${NEST_API}`;
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
