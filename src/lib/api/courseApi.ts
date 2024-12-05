import { apiClient } from "./apiClient";

export const courseAPI = {
  getCourses: async () => {
    return apiClient.get("course/courses");
  },
  search: async (keyword: string) => {
    return apiClient.get("course/courses/search?keyword=" + keyword);
  }
};
