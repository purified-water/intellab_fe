import { apiClient } from "./apiClient";
import { ProblemType } from "@/types/ProblemType";
import { ProblemsResponse } from "@/pages/ProblemsPage/types/resonseType";
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CHILDREN_SIZE = 10;

export const problemAPI = {
  getProblems: async (keyword: string, page: number, size: number) => {
    const response = await apiClient.get(`problem/problems/search?keyword=${keyword}&page=${page}&size=${size}`);
    const data: ProblemsResponse = response.data;
    return data;
  },
  getProblemDetail: async (problemId: string) => {
    const response = await apiClient.get(`problem/problems/${problemId}`);
    const data: ProblemType = response.data;
    console.log("Problem detail in api", data);
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
      submitOrder: submitOrder,
      code: code,
      programmingLanguage: programmingLanguage,
      problemId: problemId,
      userId: userId
    });
    return response.data;
  },
  // RUN CODE
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
  // GET BOILERPLATE CODE
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
  // SUBMISSIONS INFO
  getTestCaseDetail: async (testCaseId: string) => {
    const response = await apiClient.get(`problem/test-case/${testCaseId}`);
    return response.data;
  },
  getSubmissionHistory: async (problemId: string) => {
    const response = await apiClient.get(`problem/problem-submissions/submitList/${problemId}`);
    return response.data;
  },
  // COMMENTS
  getProblemComments: async (
    userId: string | null = null,
    problemId: string,
    sort: string[],
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE,
    childrenSize: number = DEFAULT_CHILDREN_SIZE
  ) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("childrenSize", childrenSize.toString());
    if (userId) {
      params.append("userId", userId);
    }

    // Append each sort value as a separate query parameter (support multi sort if needed)
    sort.forEach((s) => params.append("sort", s));

    const response = await apiClient.get(`problem/problems/${problemId}/comments`, { params });

    return response.data;
  },
  postComment: async (
    content: string,
    problemId: string,
    parentCommentId: string | null,
    replyToCommentId: string | null
  ) => {
    const response = await apiClient.post(`problem/problem-comments`, {
      content: content,
      problemId: problemId,
      parentCommentId: parentCommentId ?? null,
      replyToCommentId: replyToCommentId ?? null
    });
    return response.data;
  },
  postUpvoteComment: async (commentId: string) => {
    const response = await apiClient.post(`problem/problem-comments/${commentId}/upvote`);
    return response.data;
  },
  postRemoveUpvoteComment: async (commentId: string) => {
    const response = await apiClient.post(`problem/problem-comments/${commentId}/cancel-upvote`);
    return response.data;
  },
  putEditComment: async (commentId: string, content: string) => {
    const response = await apiClient.put(`problem/problem-comments/${commentId}`, {
      content: content
    });
    return response.data;
  },
  deleteComment: async (commentId: string) => {
    const response = await apiClient.delete(`problem/problem-comments/${commentId}/soft`);
    return response.data;
  },
  getSecondLevelReplies: async (parentCommentId: string, page: number = 0, size: number = DEFAULT_CHILDREN_SIZE) => {
    const response = await apiClient.get(`problem/problem-comments/${parentCommentId}/children`, {
      params: {
        page: page,
        size: size
      }
    });
    return response.data;
  }
};
