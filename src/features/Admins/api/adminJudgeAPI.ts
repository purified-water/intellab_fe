import { apiClient } from "@/lib/api";

export const adminJudgeAPI = {
  getJudgePods: async () => {
    const response = await apiClient.get("problem/judge0/pods");
    return response.data;
  },
  postJudgeScale: async (replicas: number) => {
    const response = await apiClient.post("problem/judge0/scale", { replicas });
    return response.data;
  }
};
