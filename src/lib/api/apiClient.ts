// Testing refresh token
import { tokenCleanUp } from "@/utils";
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOCKER_URL,
  withCredentials: true
});

interface QueuedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}

class TokenRefreshManager {
  private static isRefreshing = false;
  private static failedQueue: QueuedRequest[] = [];

  /**
   * Process all queued requests after token refresh
   * @param error - Error from token refresh (if any)
   * @param token - New access token (if refresh successful)
   */
  static processQueue(error?: AxiosError | null, token?: string) {
    // If there's an error, reject all queued requests
    if (error) {
      this.failedQueue.forEach(({ reject }) => reject(error));
    }
    // If token is available, retry all queued requests
    else if (token) {
      this.failedQueue.forEach(({ config, resolve, reject }) => {
        // Create a new config object with updated Authorization header
        const updatedConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`
          }
        };

        // Retry the request
        axios(updatedConfig).then(resolve).catch(reject);
      });
    }

    // Clear the queue
    this.failedQueue = [];
  }

  /**
   * Refresh the access token
   * @returns Promise resolving to new access token
   */
  static async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOCKER_URL}/identity/auth/refresh`,
        { token: refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      // For testing Update tokens
      // Cookies.set("accessToken", data.accessToken, {
      //   secure: import.meta.env.NODE_ENV === "production",
      //   sameSite: "Strict",
      //   expires: 1 / 8640
      // });

      Cookies.set("accessToken", data.accessToken, {
        secure: import.meta.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: 1 / 24
      });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      return data.accessToken;
    } catch (error) {
      // Handle token refresh failure
      tokenCleanUp();
      window.location.href = "/login";
      throw error;
    }
  }

  /**
   * Handle token refresh, preventing multiple simultaneous attempts
   * @returns Promise resolving to new access token
   */
  static async handleTokenRefresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshToken()
          .then((token) => {
            this.isRefreshing = false;
            this.processQueue(null, token);
            resolve(token);
          })
          .catch((error) => {
            this.isRefreshing = false;
            this.processQueue(error);
            reject(error);
          });
      } else {
        // If refresh is in progress, add to queue
        this.failedQueue.push({
          resolve: (response: AxiosResponse) => resolve(response.data),
          reject,
          config: {} as InternalAxiosRequestConfig
        });
      }
    });
  }
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const publicRoutes = ["/auth/login", "/auth/register"];

    if (config.url && publicRoutes.some((route) => config.url?.includes(route))) {
      return config;
    }
    // For testing as cookies can set expire time
    // const token = Cookies.get("accessToken");
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await TokenRefreshManager.handleTokenRefresh();

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Optional: Redirect to login
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
