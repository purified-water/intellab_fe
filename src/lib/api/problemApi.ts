import { apiClient } from "./apiClient";
import { ProblemType } from "@/types/ProblemType";
import { ProblemsResponse } from "@/features/Problem/types";
import { TGetSubmissionListMeResponse } from "@/features/Profile/types";
import { IGetCategories } from "@/features/StudentOverall/types";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CHILDREN_SIZE = 10;

export const problemAPI = {
  getProblems: async (
    keyword: string,
    page: number,
    size: number,
    categoryIds: number[],
    level: string | null,
    status: boolean | null
  ) => {
    // Create params object with non-null/non-empty values
    const params: Record<string, string | number | boolean> = {
      keyword,
      page,
      size
    };

    // Only add categories if the array is not empty
    if (categoryIds.length > 0) {
      params.categories = categoryIds.join(",");
    }

    // Only add level if it's not null
    if (level !== null) {
      params.level = level;
    }

    // Only add status if it's not null
    if (status !== null) {
      params.status = status;
    }

    const response = await apiClient.get(`problem/problems/search`, { params });
    const data: ProblemsResponse = response.data;
    return data;
  },
  getCategories: async () => {
    const response = await apiClient.get(`problem/problems/categories`);
    const data: IGetCategories = response.data;
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
  getCommentById: async (commentId: string) => {
    const response = await apiClient.get(`problem/problem-comments/${commentId}`);
    return response.data;
  },
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
    const response = await apiClient.delete(`problem/problem-comments/${commentId}`);
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
  },
  getCommentParentAndChildren: async (commentId: string, userId: string) => {
    const response = await apiClient.get(`problem/problem-comments/${commentId}/root-and-children`, {
      params: {
        userId: userId
      }
    });
    return response.data;
  },

  getSubmissionListMe: async (UserUid: string | null) => {
    const queryParams = {
      UserUid
    };
    const response = await apiClient.get(`problem/problem-submissions/submitList/me`, { params: queryParams });
    const data: TGetSubmissionListMeResponse = response.data;
    return data;
  },

  postViewSolutionBeforePassed: async (problemId: string) => {
    const response = await apiClient.post(`problem/problems/viewSolution?problemId=${problemId}`);
    return response.data;
  },
  // Call this after polling submit code to set isSolved true if accepted
  // Because calling get /submitList alone doesnt update the isSolved field for the test case
  getSubmissionIsSolved: async (submissionId: string) => {
    await apiClient.get(`problem/problem-submissions/${submissionId}`);
  }
};
