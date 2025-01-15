import { apiClient } from "./apiClient";
import { ProblemType } from "@/types/ProblemType";
// const DEFAULT_PAGE_SIZE = 20;

export const problemApi = {
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
