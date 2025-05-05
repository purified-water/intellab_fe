import { apiClient } from "@/lib/api/apiClient";

export const adminCourseAPI = {
  postCreateCourseWithStep: async (step: string, data: FormData) => {
    const response = await apiClient.post(`/admin/courses/${step}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }
};
