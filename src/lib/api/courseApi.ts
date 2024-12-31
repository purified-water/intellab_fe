import { apiClient } from "./apiClient";
import {
  IGetCoursesResponse,
  IGetCourseDetailResponse,
  IGetCourseLessonsResponse,
  IEnrollCourseResponse,
  IGetLessonDetailResponse,
  IGetUserEnrolledCoursesResponse
} from "../../pages/HomePage/types/responseTypes";
import { LearningStatus } from "@/constants/enums/lessonLearningStatus";

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

  getLessons: async (courseId: string) => {
    const response = await apiClient.get(`/course/courses/${courseId}/lessons`);
    const data: IGetCourseLessonsResponse = response.data;
    return data;
  },

  getLessonsAfterEnroll: async (courseId: string, userUid: string) => {
    const response = await apiClient.get(`/course/courses/${courseId}/${userUid}/lessons`);
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

  getLessonQuiz: async (lessonId: string) => {
    const response = await apiClient.get(`/course/lessons/${lessonId}/quiz`);
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
