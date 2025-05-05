import { apiClient } from "./apiClient";
import {
  IGetCoursesResponse,
  IGetCourseDetailResponse,
  IGetCourseLessonsResponse,
  IEnrollCourseResponse,
  IGetLessonDetailResponse,
  IGetUserEnrolledCoursesResponse,
  IGetCategories,
  IReviewsResponse,
  ReviewStatsResponse
} from "@/features/StudentOverall/types";
import { SubmitQuizType } from "@/features/Quiz/types/SubmitQuizType";
import { LearningStatus } from "@/constants/enums/lessonLearningStatus";
import {
  TCancelUpvoteCommentResponse,
  TCreateCommentResponse,
  TDeleteCommentResponse,
  TGetCourseCommentsResponse,
  TGetCommentResponse,
  TGetCommentChildrenResponse,
  TModifyCommentResponse,
  TUpvoteCommentResponse,
  TUpvoteCommentParams,
  TCancelUpvoteCommentParams,
  TModifyCommentParams,
  TGetCourseCommentsParams,
  TCreateCommentParams,
  TGetCommentParams,
  TGetCommentChildrenParams,
  TDeleteCommentParams
} from "@/features/Course/types";
import { TGetCompletedCourseListMeResponse } from "@/features/Profile/types";
import { API_RESPONSE_CODE } from "@/constants";
import {
  TGetCourseForAdminResponse,
  TDeleteCourseResponse,
  TGetCourseForAdminParams,
  TDeleteCourseParams,
  TUpdateCourseAvailabilityResponse,
  TUpdateCourseAvailabilityParams
} from "@/features/Admins/features/course/types";

const DEFAULT_PAGE_SIZE = 10;

export const courseAPI = {
  getCourses: async () => {
    const response = await apiClient.get(`course/courses`);
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  getUnEnrollCourses: async (userUid: string) => {
    const response = await apiClient.get(`course/courses/exceptEnrolled?userUid=${userUid}`);
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  getCategories: async () => {
    const response = await apiClient.get(`course/courses/categories`);
    const data: IGetCategories = response.data;
    return data;
  },

  getReviews: async (courseId: string, page: number, size: number, rating: string | null) => {
    const rating_param = rating === "all" ? null : Number(rating);
    const response = await apiClient.get(`course/courses/${courseId}/reviews`, {
      params: {
        page,
        size,
        sort: "createAt,desc",
        ...(rating_param !== null && { rating: rating_param })
      }
    });
    const data: IReviewsResponse = response.data;
    return data;
  },

  getReviewStats: async (courseId: string) => {
    const response = await apiClient.get(`course/courses/${courseId}/reviews-stats`);
    const data: ReviewStatsResponse = response.data;
    return data;
  },

  postReview: async (reviewData: { rating: number; comment: string; userUid: string; courseId: string }) => {
    const response = await apiClient.post(`course/reviews`, reviewData);
    return response.data;
  },

  search: async (keyword: string, page: number) => {
    const response = await apiClient.get(`course/courses/search?keyword=${keyword}&page=${page}`);
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  getCourseDetail: async (courseId: string) => {
    const response = await apiClient.get(`/course/courses/${courseId}`);
    const data: IGetCourseDetailResponse = response.data;
    return data;
  },

  getLessons: async (courseId: string, page: number, size: number = DEFAULT_PAGE_SIZE) => {
    const response = await apiClient.get(`/course/courses/${courseId}/lessons`, {
      params: {
        page,
        size
      }
    });
    const data: IGetCourseLessonsResponse = response.data;
    return data;
  },

  getLessonsAfterEnroll: async (courseId: string, page: number, size: number = DEFAULT_PAGE_SIZE) => {
    const response = await apiClient.get(`/course/courses/${courseId}/lessons/me`, {
      params: {
        page,
        size
      }
    });
    const data: IGetCourseLessonsResponse = response.data;
    return data;
  },

  enrollCourse: async (userUid: string, courseId: string) => {
    const postData = {
      userUid,
      courseId
    };
    const response = await apiClient.post(`/course/courses/enroll`, postData);
    const data: IEnrollCourseResponse = response?.data;
    return data;
  },

  getLessonDetail: async (lessonId: string) => {
    const response = await apiClient.get(`/course/lessons/${lessonId}`);
    const data: IGetLessonDetailResponse = response.data;
    return data;
  },

  getLessonQuiz: async (lessonId: string, numberOfQuestion: number = 10, isGetAssignment: number | null) => {
    // isGetAssignment = 1 to get quiz with options that has passed or failed
    // isGetAssignment = 0 | null to get quiz first time
    const response = await apiClient.get(
      `/course/lessons/${lessonId}/quiz?numberOfQuestions=${numberOfQuestion}&isGetAssignment=${isGetAssignment}`
    );
    return response.data;
  },

  postSubmitQuiz: async (
    lessonId: string,
    { score, exerciseId, learningId, assignmentDetailRequests }: SubmitQuizType
  ) => {
    const response = await apiClient.post(`/course/lessons/${lessonId}/submitquiz`, {
      score,
      exerciseId,
      learningId,
      assignmentDetailRequests
    });
    return response.data;
  },

  updateLessonLearningProgress: async (learningId: string, courseId: string) => {
    const response = await apiClient.put(`/course/lessons/${learningId}/${courseId}/updateLearningProgress`, {
      status: LearningStatus.IN_PROGRESS
    });
    return response.data;
  },

  updateTheoryDone: async (learningId: string, courseId: string) => {
    const response = await apiClient.put(`/course/lessons/${learningId}/${courseId}/doneTheory`);
    return response.data;
  },

  updatePracticeDone: async (learningId: string, courseId: string) => {
    const response = await apiClient.put(`/course/lessons/${learningId}/${courseId}/donePractice`);
    return response.data;
  },

  getUserEnrolledCourses: async () => {
    const response = await apiClient.get(`/course/courses/me/enrolledCourses`);
    const data: IGetUserEnrolledCoursesResponse = response.data;
    return data;
  },

  upvoteComment: async ({ query, onStart, onSuccess, onFail, onEnd }: TUpvoteCommentParams) => {
    const DEFAULT_ERROR = "Error upvoting comment";

    if (onStart) {
      await onStart();
    }
    try {
      const commentId = query!.commentId;
      const response = await apiClient.put(`/course/courses/comments/${commentId}/upvote`);
      const data: TUpvoteCommentResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  cancelUpvoteComment: async ({ query, onStart, onSuccess, onFail, onEnd }: TCancelUpvoteCommentParams) => {
    const DEFAULT_ERROR = "Error canceling upvote comment";

    if (onStart) {
      await onStart();
    }
    try {
      const { commentId } = query!;
      const response = await apiClient.put(`/course/courses/comments/${commentId}/cancelUpvote`);
      const data: TCancelUpvoteCommentResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  modifyComment: async ({ body, onStart, onSuccess, onFail, onEnd }: TModifyCommentParams) => {
    const DEFAULT_ERROR = "Error modifying comment";

    if (onStart) {
      await onStart();
    }
    try {
      const { commentId, content } = body!;
      const response = await apiClient.put(`/course/courses/comments/modify`, { commentId, content });
      const data: TModifyCommentResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getCourseComments: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetCourseCommentsParams) => {
    const DEFAULT_ERROR = "Error getting course comments";

    if (onStart) {
      await onStart();
    }
    try {
      const { courseId, userUid, page, sort } = query!;
      const response = await apiClient.get(`/course/courses/${courseId}/comments`, {
        params: {
          page,
          userUid,
          size: DEFAULT_PAGE_SIZE,
          sort
        }
      });
      const data: TGetCourseCommentsResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  createComment: async ({ query, body, onStart, onSuccess, onFail, onEnd }: TCreateCommentParams) => {
    const DEFAULT_ERROR = "Error creating comment";

    if (onStart) {
      await onStart();
    }
    try {
      const { courseId } = query!;
      const { content, repliedCommentId, parentCommentId } = body!;
      const response = await apiClient.post(`/course/courses/${courseId}/comments`, {
        content,
        repliedCommentId,
        parentCommentId
      });
      const data: TCreateCommentResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getComment: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetCommentParams) => {
    const DEFAULT_ERROR = "Error getting comment";

    if (onStart) {
      await onStart();
    }
    try {
      const { commentId, userUid, page, size, sort } = query!;
      const response = await apiClient.get(`/course/courses/comments/${commentId}`, {
        params: {
          userUid,
          page,
          size,
          sort
        }
      });
      const data: TGetCommentResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getCommentChildren: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetCommentChildrenParams) => {
    const DEFAULT_ERROR = "Error getting comment children";

    if (onStart) {
      await onStart();
    }
    try {
      const { commentId, userUid, size } = query!;
      const response = await apiClient.get(`/course/courses/comments/${commentId}/children`, {
        params: {
          userUid,
          size,
          sort: "created,desc"
        }
      });
      const data: TGetCommentChildrenResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  deleteComment: async ({ query, onStart, onSuccess, onFail, onEnd }: TDeleteCommentParams) => {
    const DEFAULT_ERROR = "Error deleting comment";

    if (onStart) {
      await onStart();
    }
    try {
      const { commentId } = query!;
      const response = await apiClient.delete(`/course/courses/comments/${commentId}/delete`);
      const data: TDeleteCommentResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getCompletedCourseListMe: async (UserUid: string) => {
    const queryParams = {
      UserUid
    };
    const response = await apiClient.get(`/course/courses/courseList/me`, { params: queryParams });
    const data: TGetCompletedCourseListMeResponse = response.data;
    return data;
  },

  getCourseForAdmin: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetCourseForAdminParams) => {
    const DEFAULT_ERROR = "Error getting course for admin";

    if (onStart) {
      await onStart();
    }
    try {
      const { filter } = query!;
      const { keyword, rating, levels, categories, prices, isCompletedCreation } = filter;
      const categoryIds = categories.map((category) => category.categoryId);
      const response = await apiClient.get(`/course/courses/search`, {
        params: {
          keyword: keyword,
          ratings: rating ? (parseFloat(rating) > 0 ? parseFloat(rating) : null) : null,
          price: prices.length === 1 && prices.some((price) => price === "Paid"),
          categories: categoryIds.join(","),
          levels: levels.length > 0 ? levels.join(",") : null,
          isCompletedCreation: isCompletedCreation,
          size: 100
        }
      });
      const data: TGetCourseForAdminResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  deleteCourse: async ({ query, onStart, onSuccess, onFail, onEnd }: TDeleteCourseParams) => {
    const DEFAULT_ERROR = "Error deleting course";
    if (onStart) {
      await onStart();
    }
    try {
      const { courseId } = query!;
      const response = await apiClient.delete(`/course/courses/${courseId}`);
      const data: TDeleteCourseResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  updateCourseAvailability: async ({ query, onStart, onSuccess, onFail, onEnd }: TUpdateCourseAvailabilityParams) => {
    const DEFAULT_ERROR = "Error updating course availability";
    if (onStart) {
      await onStart();
    }
    try {
      const { courseId, isAvailable } = query!;
      const response = await apiClient.put(
        `/course/courses/update-available-status/${courseId}?availableStatus=${isAvailable}`
      );
      const data: TUpdateCourseAvailabilityResponse = response.data;
      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  }
};
