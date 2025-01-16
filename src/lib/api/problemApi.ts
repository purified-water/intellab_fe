import { apiClient } from "./apiClient";
import { ProblemType } from "@/types/ProblemType";
import { ProblemsResponse } from "@/pages/ProblemsPage/types/resonseType";
// const DEFAULT_PAGE_SIZE = 20;

export const problemAPI = {
  getProblems: async (keyword: string, page: number, size: number) => {
    const response = await apiClient.get(`problem/problems/search?keyword=${keyword}&page=${page}&size=${size}`);
    const data: ProblemsResponse = response.data;
    return data;
  },
  getProblemDetail: async (problemId: string) => {
    const response = await apiClient.get(`problem/problems/${problemId}`);
    const data: ProblemType = response.data;
    return data;
  },
  createSubmission: async (
    submitOrder: number = 1,
    code: string,
    programmingLanguage: string,
    problemId: string,
    userUid: string
  ) => {
    const response = await apiClient.post(`problem/submissions`, {
      submit_order: submitOrder,
      code: code,
      programming_langugage: programmingLanguage,
      problem: { problemId },
      userUid
    });
    return response.data;
  }
};
