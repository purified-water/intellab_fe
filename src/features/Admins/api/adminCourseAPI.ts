import { apiClient } from "@/lib/api/apiClient";
import {
  CreateCourseGeneralStepPayload,
  CreateCourseLessonStepPayload,
  CreateCourseFinalStepPayload,
  CreateCoursePreviewStepPayload,
  UpdateCourseLessonPayload,
  CreateCourseLessonQuizPayload
} from "@/types";

export const adminCourseAPI = {
  // Step 1
  postCreateCourseGeneralStep: async (payload: CreateCourseGeneralStepPayload) => {
    const response = await apiClient.post(`course/admin/courses/general-step`, payload);
    return response.data.result;
  },

  // Upload course image
  postCreateCourseThumbnail: async (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`course/admin/courses/${courseId}/image/upload-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  },

  // Step 2
  // Add a lesson (call first to init the lessonId)
  postCreateCourseLesson: async (payload: CreateCourseLessonStepPayload) => {
    const response = await apiClient.post(`course/admin/lessons`, payload);
    return response.data.result;
  },
  // After initializing the lessonId, we can update the lesson
  // NOTE: this API doesn't include updating quiz, its a separate API
  putCreateCourseLesson: async (payload: UpdateCourseLessonPayload) => {
    const response = await apiClient.put(`course/admin/lessons`, payload);
    return response.data;
  },
  // Add a quiz to the lesson
  putCreateCourseLessonQuiz: async (payload: CreateCourseLessonQuizPayload) => {
    const response = await apiClient.put(`course/admin/lessons/quiz`, payload);
    return response.data;
  },

  // Reorder the lessons
  putCreateCourseLessonReorder: async (payload: { courseId: string; lessonIds: string[] }) => {
    const response = await apiClient.put(`course/admin/lessons/lessonsOrder`, payload);
    return response.data;
  },

  // Step 3
  postCreateCourseFinalStep: async (courseId: string, payload: CreateCourseFinalStepPayload) => {
    const response = await apiClient.post(`course/admin/courses/final-step/${courseId}`, payload);
    return response.data;
  },

  // Step 4
  putCreateCoursePreviewStep: async (courseId: string, payload: CreateCoursePreviewStepPayload) => {
    const response = await apiClient.put(
      `course/admin/courses/update-available-status/${courseId}?availableStatus=${payload.availableStatus}`
    );
    return response.data.result;
  },

  // HELPERS FOR CREATING A COURSE
  // Get the list of categories
  getCreateCourseCategories: async () => {
    const response = await apiClient.get(`course/courses/categories`);
    return response.data.result;
  },

  getCreateCourseLessonList: async (courseId: string) => {
    const response = await apiClient.get(`course/admin/courses/${courseId}/lessonsList`);
    return response.data.result;
  },

  getCreateCourseCertificateTemplates: async (templateIndex: number) => {
    const response = await apiClient.get(`course/admin/courses/certificate/template/${templateIndex}`);
    return response.data;
  },

  // HELPERS FOR CREATING A LESSON
  // Get the list of quiz of a lesson
  getCreateLessonQuizList: async (lessonId: string) => {
    const response = await apiClient.get(`course/admin/lessons/quiz/${lessonId}`);
    return response.data.result;
  },
  // Get the problem list when creating a lesson
  getCreateLessonProblemList: async () => {
    const response = await apiClient.get(`problem/problems/createLesson/problemList`);
    return response.data.result;
  },

  deleteCreateLesson: async (lessonId: string) => {
    const response = await apiClient.delete(`course/admin/lessons/${lessonId}`);
    return response.data;
  }
};
