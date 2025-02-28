import { apiClient } from "./apiClient";
import {
  IGetCoursesResponse,
  IGetCourseDetailResponse,
  IGetCourseLessonsResponse,
  IEnrollCourseResponse,
  IGetLessonDetailResponse,
  IGetUserEnrolledCoursesResponse,
  IGetCategories
} from "../../pages/HomePage/types/responseTypes";
import { IReviewsResponse, ReviewStatsResponse } from "../../pages/HomePage/types/reviewResponse";
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
  TUpvoteCommentResponse
} from "@/features/Course/types/apiResponseType";

const DEFAULT_PAGE_SIZE = 5;

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

  getReviews: async (courseId: string, page: number, size: number) => {
    const response = await apiClient.get(
      `course/courses/${courseId}/reviews?page=${page}&size=${size}&sort=createAt,desc`
    );
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

  getCourseDetail: async (courseId: string, userUid: string) => {
    const response = await apiClient.get(`/course/courses/${courseId}?userUid=${userUid}`);
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

  // Comment APIs
  upvoteComment: async (commentId: string) => {
    const response = await apiClient.put(`/course/courses/comments/${commentId}/upvote`);
    const data: TUpvoteCommentResponse = response.data;
    return data;
  },

  cancelUpvoteComment: async (commentId: string) => {
    const response = await apiClient.put(`/course/courses/comments/${commentId}/cancelUpvote`);
    const data: TCancelUpvoteCommentResponse = response.data;
    return data;
  },

  modifyComment: async (commentId: string, content: string) => {
    const response = await apiClient.put(`/course/courses/comments/modify`, { commentId, content });
    const data: TModifyCommentResponse = response.data;
    return data;
  },

  getCourseComments: async (
    courseId: string,
    userUid: string | null,
    page: number | null,
    sort: string | null
    //childrenPage: number | null
  ) => {
    const queryParams = {
      page,
      userUid,
      size: 10,
      sort
      // childrenPage,
      // childrenSize: 5,
      // childrenSortBy: "created",
      // childrenSortOrder: "desc"
    };
    const response = await apiClient.get(`/course/courses/${courseId}/comments`, { params: queryParams });
    const data: TGetCourseCommentsResponse = response.data;
    return data;
  },

  createComment: async (
    courseId: string,
    content: string,
    repliedCommentId: string | null,
    parentCommentId: string | null
  ) => {
    const response = await apiClient.post(`/course/courses/${courseId}/comments`, {
      content,
      repliedCommentId,
      parentCommentId
    });
    const data: TCreateCommentResponse = response.data;
    return data;
  },

  getComment: async (
    commentId: string,
    userUid: string | null,
    page: number | null,
    size: number | null,
    sort: string[] | null
  ) => {
    const queryParams = {
      userUid,
      page,
      size,
      sort
    };

    const response = await apiClient.get(`/course/courses/comments/${commentId}`, { params: queryParams });
    const data: TGetCommentResponse = response.data;
    return data;
  },

  getCommentChildren: async (commentId: string, userUid: string | null, size: number | null) => {
    const queryParams = {
      userUid,
      size,
      sort: "created,desc"
    };
    const response = await apiClient.get(`/course/courses/comments/${commentId}/children`, { params: queryParams });
    const data: TGetCommentChildrenResponse = response.data;
    return data;
  },

  deleteComment: async (commentId: string) => {
    const response = await apiClient.delete(`/course/courses/comments/${commentId}/delete`);
    const data: TDeleteCommentResponse = response.data;
    return data;
  }
};
