import { apiClient } from "./apiClient";
import {
  IGetCoursesResponse,
  IGetCourseDetailResponse,
  IGetCourseLessonsResponse,
  IEnrollCourseResponse,
  IGetLessonDetailResponse
} from "./responseTypes";

export const courseAPI = {
  getCourses: async () => {
    const response = await apiClient.get("course/courses");
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  search: async (keyword: string) => {
    const response = await apiClient.get(`course/courses/search?keyword=${keyword}`);
    const data: IGetCoursesResponse = response.data;
    return data;
  },

  getCourseDetail: async (courseId: string) => {
    const response = await apiClient.get(`/course/courses/${courseId}`);
    const data: IGetCourseDetailResponse = response.data;
    return data;
  },

  getLessons: async (courseId: string) => {
    const response = await apiClient.get(`/course/courses/${courseId}/lessons`);
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
  }
};
