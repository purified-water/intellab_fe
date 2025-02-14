// import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
// import Cookies from "js-cookie";

// export const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_SERVER_DOCKER_URL,
//   withCredentials: true // Ensures cookies (like refreshToken) are sent with requests
// });

// let isRefreshing = false;
// let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: AxiosError) => void }> = [];

// const processQueue = (error: AxiosError | null, token?: string | null) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     token ? resolve(token) : reject(error as AxiosError);
//   });
//   failedQueue = [];
// };

// const refreshToken = async (): Promise<string> => {
//   try {
//     const { data } = await axios.post<{ accessToken: string }>(
//       `${import.meta.env.VITE_SERVER_DOCKER_URL}/auth/refresh`,
//       {},
//       { withCredentials: true } // Ensures refresh token is sent automatically
//     );

//     Cookies.set("accessToken", data.accessToken, { expires: 1 });
//     return data.accessToken;
//   } catch (refreshError) {
//     Cookies.remove("accessToken");
//     window.location.href = "/login";
//     throw refreshError;
//   }
// };

// // Request Interceptor - Attach Access Token (No Preemptive Check)
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = Cookies.get("accessToken");

//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// // Response Interceptor - Handle 401 Unauthorized
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     // If token is invalid or expired, try refreshing it
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           const newToken = await refreshToken();
//           processQueue(null, newToken);
//           isRefreshing = false;

//           // Retry the original request with new token
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           processQueue(refreshError as AxiosError, null);
//           isRefreshing = false;
//           return Promise.reject(refreshError);
//         }
//       } else {
//         return new Promise<string>((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return apiClient(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;

// OLD API CLIENT WITHOUT REFRESH TOKEN
import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOCKER_URL
});

// Add an interceptor to include the token in the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
