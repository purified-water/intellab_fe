import { ProblemsResponse } from "@/pages/ProblemsPage/types/resonseType";
import { apiClient } from "./apiClient";

export const problemAPI = {
  getProblems: async (keyword: string, page: number, size: number) => {
    const response = await apiClient.get(`problem/problems/search?keyword=${keyword}&page=${page}&size=${size}`);
    const data: ProblemsResponse = response.data;
    return data;
  }
};
