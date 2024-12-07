import { apiClient } from "./apiClient";
import {
  IEnrollCourseResponse,
  IGetCourseDetailResponse,
  IGetCourseLessonsResponse,
  IGetLessonDetailResponse
} from "@/features/Course/types";
//import { terminal } from "virtual:terminal"; // for debugging

export const courseAPI = {
  getCourses: async () => {
    return apiClient.get("course/courses");
  },

  search: async (keyword: string) => {
    return apiClient.get("course/courses/search?keyword=" + keyword);
  },

  getCourseDetail: async (courseId: string) => {
    const response: IGetCourseDetailResponse = await apiClient.get(`/course/courses/${courseId}`);
    return response;
  },

  getLessons: async (courseId: string) => {
    const response: IGetCourseLessonsResponse = await apiClient.get(`/course/courses/${courseId}/lessons`);
    return response;
  },

  enrollCourse: async (useUid: string, courseId: string) => {
    const response: IEnrollCourseResponse = await apiClient.post(`/course/enroll`, {
      userUid: useUid,
      courseId: courseId
    });
    return response;
  },

  getLessonDetail: async (lessonId: string) => {
    const response: IGetLessonDetailResponse = await apiClient.get(`/course/lessons/${lessonId}`);
    return response;
  }
};
