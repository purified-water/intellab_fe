import { apiClient } from "./apiClient";
import { ProblemType } from "@/types/ProblemType";
import { ProblemsResponse } from "@/pages/ProblemsPage/types/resonseType";
// const DEFAULT_PAGE_SIZE = 20;

export const problemAPI = {
  getProblems: async (keyword: string, page: number, size: number, userUid: string) => {
    const response = await apiClient.get(
      `problem/problems/search?keyword=${keyword}&page=${page}&size=${size}&userUid=${userUid}`
    );
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
    userId: string
  ) => {
    const response = await apiClient.post(`problem/problem-submissions`, {
      submit_order: submitOrder,
      code: code,
      programming_language: programmingLanguage,
      problem: { problemId },
      userId: userId
    });
    return response.data;
  },
  postRunCode: async (code: string, languageId: number, problemId: string) => {
    const response = await apiClient.post(`problem/problem-run-code`, {
      code: code,
      languageId: languageId,
      problemId: problemId
    });
    return response.data;
  },
  getRunCodeUpdate: async (runCodeId: string) => {
    const response = await apiClient.get(`problem/problem-run-code/${runCodeId}`);
    return response.data;
  },
  getBoilerplateCode: async (problemId: string) => {
    const response = await apiClient.get(`problem/problems/${problemId}/partial-boilerplate`);
    return response.data;
  },
  getUpdateSubmission: async (submissionId: string) => {
    const response = await apiClient.get(`problem/problem-submissions/${submissionId}`);
    return response.data;
  },
  getProblemTestCases: async (problemId: string) => {
    const response = await apiClient.get(`problem/test-case/problem/${problemId}`);
    return response.data;
  },
  getTestCaseDetail: async (testCaseId: string) => {
    const response = await apiClient.get(`problem/test-case/${testCaseId}`);
    return response.data;
  }
};
