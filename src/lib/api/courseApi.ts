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
import { IReviewsResponse } from "../../pages/HomePage/types/reviewResponse";
import { SubmitQuizType } from "@/features/Quiz/types/SubmitQuizType";
import { LearningStatus } from "@/constants/enums/lessonLearningStatus";

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

  getReviews: async (courseId: string) => {
    const response = await apiClient.get(`course/courses/${courseId}/reviews`);
    const data: IReviewsResponse = response.data;
    return data;
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

  getLessonsAfterEnroll: async (userId: string, courseId: string, page: number, size: number = DEFAULT_PAGE_SIZE) => {
    const response = await apiClient.get(`/course/courses/${courseId}/lessons/me/${userId}`, {
      params: {
        page,
        size
      }
    });
    console.log("response", response);
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

  getLessonDetail: async (lessonId: string, userId: string) => {
    const response = await apiClient.get(`/course/lessons/${lessonId}/${userId}`);
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

  updateLessonLearningProgress: async (learningId: string, courseId: string, userId: string) => {
    const response = await apiClient.put(`/course/lessons/${learningId}/${courseId}/${userId}/updateLearningProgress`, {
      status: LearningStatus.IN_PROGRESS
    });
    return response.data;
  },

  updateTheoryDone: async (learningId: string, courseId: string, userId: string) => {
    const response = await apiClient.put(`/course/lessons/${learningId}/${courseId}/${userId}/doneTheory`);
    return response.data;
  },

  updatePracticeDone: async (learningId: string, courseId: string, userId: string) => {
    const response = await apiClient.put(`/course/lessons/${learningId}/${courseId}/${userId}/donePractice`);
    return response.data;
  },

  getUserEnrolledCourses: async (userUid: string) => {
    const response = await apiClient.get(`/course/courses/${userUid}/enrolledCourses`);
    const data: IGetUserEnrolledCoursesResponse = response.data;
    return data;
  }
};
