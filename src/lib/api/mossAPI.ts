import apiClient from "./apiClient";

export const mossAPI = {
  getMossResult: async (submissionId: string) => {
    const response = await apiClient.get(`problem/problem-submissions/moss/${submissionId}`);
    return response.data;
  }
};
