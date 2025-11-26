import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getSession, signOut } from "next-auth/react";
export class SilentError extends Error {
  constructor(
    public originalError: any,
    message = "Silent Error (auth or permission issue)"
  ) {
    super(message);
    this.name = "SilentError";
  }
}

export abstract class BaseApiService {
  protected axiosInstance: AxiosInstance;
  protected baseUrl: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  private cachedSession: { session: any; timestamp: number } | null = null;
  private readonly SESSION_CACHE_TIME = 5 * 60 * 1000;

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

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private async getCachedSession() {
    const now = Date.now();

    if (
      this.cachedSession &&
      now - this.cachedSession.timestamp < this.SESSION_CACHE_TIME
    ) {
      return this.cachedSession.session;
    }

    const session = await getSession();

    if (session) {
      this.cachedSession = {
        session,
        timestamp: now,
      };
    } else {
      this.cachedSession = null;
    }

    return session;
  }

  private clearSessionCache() {
    this.cachedSession = null;
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
        if (this.isBrowser()) {
          const session = await this.getCachedSession();
          const token = session?.accessToken;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      error => Promise.reject(error)
    );

    instance.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 403) {
          throw new SilentError(error, "Không có quyền truy cập");
        }

        if (!originalRequest || error.response?.status !== 401) {
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        if (!this.isBrowser()) {
          return Promise.reject(error);
        }

        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({
              resolve,
              reject,
              config: originalRequest,
            });
          });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          this.clearSessionCache();
          const session = await this.getCachedSession();

          if (!session?.refreshToken) {
            console.warn("Missing refresh token, logging out...");
            this.clearSessionCache();
            await signOut({ redirect: true, callbackUrl: "/login" });
            return Promise.reject(error);
          }

          const response = await axios.post(`${this.baseUrl}/auth/refresh`, {
            refreshToken: session.refreshToken,
          });

          const { accessToken, refreshToken } = response.data.data;

          if (!accessToken) throw new Error("Invalid refresh response");

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          this.processQueue(null, { accessToken, refreshToken });

          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          this.processQueue(refreshError, null);
          this.clearSessionCache();
          await signOut({ redirect: true, callbackUrl: "/login" });
          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      }
    );

    return instance;
  }

  private processQueue(
    error: any,
    tokens: { accessToken: string; refreshToken: string } | null
  ) {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else if (tokens) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        resolve(this.axiosInstance(config));
      }
    });
    this.failedQueue = [];
  }

  protected isSilentError(error: any): boolean {
    return error instanceof SilentError;
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
        {
          responseType: "arraybuffer",
          ...config,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  protected async post<T, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  protected async put<T, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  protected async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(
        endpoint,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
