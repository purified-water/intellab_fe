// Testing refresh token
// import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
// import Cookies from "js-cookie";

// export const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_SERVER_DOCKER_URL,
//   withCredentials: true, // Ensures cookies (like refreshToken) are sent
// });

// let isRefreshing = false;
// let refreshPromise: Promise<string> | null = null;

// const refreshToken = async (): Promise<string> => {
//   try {
//     console.log("Refresh token from cookie", Cookies.get("refreshToken"));
//     console.log("Refresh token from local storage", localStorage.getItem("refreshToken"));
//     const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
//     console.log("🔒 Refresh token:", refreshToken);
//     if (!refreshToken) {
//       throw new Error("No refresh token found");
//     }

//     console.log("🔄 Refreshing access token...");
//     // ERROR GETTING REFRESH TOKEN 401 UNAUTHORIZED? WTF
//     const data = await axios.post(
//       `http://localhost:8101/identity/auth/refresh`,
//       "AMf-vBzxeAhT6LtvsrQPTgkvu7HG6R_lSGE_R3XdUAtLxJVb2e5iA0_fki95N9Rql4hlVkkUCu1DQ3MsNIAyGJ7QzOFI-CDFnejU8woSTd_CL52rPvGfKA7iDG1EeIdhJ33q3wYjXzai3OgfMeMiH0TCzD_yan8Z1GWx73mEoop5ClrzPm6gyIWtuB-IBm4KlKXPyXj5Onh78iYKexhEinR1ULEHkEj_jg",
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       }
//     );

//     console.log("✅ New access token response:", data);
//     return data.data.accessToken;

//     // Cookies.set("accessToken", data.accessToken, { expires: 1 });
//     // return data.accessToken;
//   } catch (error) {
//     console.error("❌ Token refresh failed, logging out...");
//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//     // window.location.href = "/login";
//     throw error;
//   }
// };

// // 🔹 Request Interceptor - Attach Access Token
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const publicRoutes = ["/auth/login", "/auth/register"];

//     if (config.url && publicRoutes.some(route => config.url?.includes(route))) {
//       return config; // Skip token check for login/register
//     }

//     const token = Cookies.get("accessToken");
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// // 🔹 Response Interceptor - Handle 401 Unauthorized
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;
//         refreshPromise = refreshToken().finally(() => {
//           isRefreshing = false;
//           refreshPromise = null;
//         });
//       }

//       try {
//         const newToken = await refreshPromise;
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return apiClient(originalRequest); // Retry the original request
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );



// // OLD API CLIENT WITHOUT REFRESH TOKEN
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
