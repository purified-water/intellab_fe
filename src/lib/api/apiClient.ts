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
