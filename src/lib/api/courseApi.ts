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
  TUpdateCourseAvailabilityParams,
  TUpdateCourseAvailabilityResponse
} from "@/features/Admins/features/course/types";
import { apiResponseCodeUtils } from "@/utils";
import { AxiosError } from "axios";

const DEFAULT_PAGE_SIZE = 10;

export const courseAPI = {
  getCourses: async () => {
    const response = await apiClient.get(`course/courses?isAvailable=true&isCompletedCreation=true`);
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  getFeaturedCourses: async () => {
    const response = await apiClient.get(`course/courses/featured-courses`);
    const data = response.data; // Data is contained in result (not result.content)
    return data;
  },

  getFreeCourses: async () => {
    const response = await apiClient.get(`course/courses/free-courses`);
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  getUnEnrollCourses: async (userUid: string) => {
    const response = await apiClient.get(`course/courses/exceptEnrolled?userUid=${userUid}`);
    // const data: IGetCoursesResponse = response.data;
    return response.data;
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
    const response = await apiClient.get(
      `course/courses/search?keyword=${keyword}&page=${page}&isAvailable=true&isCompletedCreation=true`
    );
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
      const { filter, page } = query!;
      const { keyword, rating, levels, categories, prices, isCompletedCreation } = filter;
      const categoryIds = categories ? categories.map((category) => category.categoryId) : null;
      const response = await apiClient.get(`/course/admin/courses/search`, {
        params: {
          keyword: keyword,
          ratings: rating ? (parseFloat(rating) > 0 ? parseFloat(rating) : null) : null,
          price: prices && prices.length > 0 ? prices.some((price) => price === "Paid") : null,
          categories: categoryIds && categoryIds.length > 0 ? categoryIds.join(",") : null,
          levels: levels && levels.length > 0 ? levels.join(",") : null,
          isCompletedCreation: isCompletedCreation,
          size: DEFAULT_PAGE_SIZE,
          page: page
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

    const handleResponseData = async (data: TDeleteCourseResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      await onStart();
    }
    try {
      const { courseId } = query!;
      const response = await apiClient.delete(`/course/admin/courses/${courseId}`);
      handleResponseData(response.data as TDeleteCourseResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TDeleteCourseResponse);
      } else if (error instanceof Error) {
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
        `/course/admin/courses/update-available-status/${courseId}?availableStatus=${isAvailable}`
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
  },

  // Certificate status check API
  checkCertificateStatus: async (courseId: string) => {
    try {
      // We use the standard course detail endpoint since it already contains certificate info
      const response = await apiClient.get(`/course/courses/${courseId}`);
      const data: IGetCourseDetailResponse = response.data;

      if (data.code === API_RESPONSE_CODE.SUCCESS) {
        const { certificateId, certificateUrl } = data.result;
        return {
          isReady: !!(certificateId && certificateUrl),
          certificateId,
          certificateUrl
        };
      }
      return { isReady: false };
    } catch (error) {
      console.error("Error checking certificate status:", error);
      return { isReady: false, error };
    }
  },

  // API to trigger certificate regeneration
  regenerateCertificate: async (courseId: string) => {
    try {
      // In a real implementation, this would be a POST request to an endpoint that triggers certificate regeneration
      // For now, we're just using the course detail endpoint to simulate this
      const response = await apiClient.get(`/course/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error regenerating certificate:", error);
      throw error;
    }
  }
};
