import { apiClient } from "./apiClient";
import { ProblemType } from "@/types/ProblemType";
// const DEFAULT_PAGE_SIZE = 20;

export const problemApi = {
  getProblemDetail: async (problemId: string) => {
    const response = await apiClient.get(`problem/problems/${problemId}`);
    const data: ProblemType = response.data;
    return data;
  }
};
