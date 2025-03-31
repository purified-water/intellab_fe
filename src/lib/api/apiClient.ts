// Testing refresh token
import { LOGIN_TYPES } from "@/constants";
import { tokenCleanUp } from "@/utils";
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAuth } from "firebase/auth";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

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
    if (error) {
      this.failedQueue.forEach(({ reject }) => reject(error));
    } else if (token) {
      this.failedQueue.forEach(({ config, resolve, reject }) => {
        const updatedConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`
          }
        };

        axios(updatedConfig).then(resolve).catch(reject);
      });
    }

    this.failedQueue = [];
  }

  /**
   * Refresh the access token based on login type
   * @returns Promise resolving to new access token
   */
  static async refreshToken(): Promise<string> {
    const loginType = localStorage.getItem("loginType");

    try {
      if (loginType === LOGIN_TYPES.EMAIL) {
        // Email login refresh token flow
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

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return data.accessToken;
      } else if (loginType === LOGIN_TYPES.GOOGLE) {
        console.log("Refreshing Google token");
        // Google login (Firebase) token refresh
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("No authenticated Google user");
        }

        // Force refresh to get a new token
        const newToken = await currentUser.getIdToken(true);

        localStorage.setItem("accessToken", newToken);

        // You might want to send this token to your backend for validation/exchange
        return newToken;
      } else {
        throw new Error("Unknown login type");
      }
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
  async (config: InternalAxiosRequestConfig) => {
    if (config.url && PUBLIC_ROUTES.some((route) => config.url?.includes(route))) {
      return config;
    }

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
    const isAuthRoute = PUBLIC_ROUTES.some((route) => originalRequest.url?.includes(route));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      console.log("Token expired, refreshing...");

      try {
        const newToken = await TokenRefreshManager.handleTokenRefresh();

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
