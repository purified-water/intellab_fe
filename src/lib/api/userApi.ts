import { apiClient } from "./apiClient";
import { UserType } from "@/types";
import { Progress } from "@/types";

export const userAPI = {
  getUser: async (accessToken: string) => {
    const response = await apiClient.post("identity/auth/validateToken", accessToken);
    const data: UserType = response.data;
    return data;
  },
  getProgress: async (userId: string) => {
    const queryParams = {
      userId: userId
    };
    const response = await apiClient.get("/problem/statistics/progress", {
      params: queryParams
    });
    const data: Progress = response.data;
    return data;
  }
};
