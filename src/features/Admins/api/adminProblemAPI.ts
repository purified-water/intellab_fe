import { apiClient } from "@/lib/api/apiClient";
import { AdminProblemParams, GetAdminProblemResponseType } from "../features/problem/types/ProblemListType";
import { DEFAULT_PAGE_SIZE } from "@/constants";

export const adminProblemAPI = {
  getAdminProblemList: async (params: AdminProblemParams): Promise<GetAdminProblemResponseType> => {
    const response = await apiClient.get(`problem/admin/problems`, {
      params: {
        isComplete: params.isComplete,
        page: params.page,
        size: params.size || DEFAULT_PAGE_SIZE,
        sort: params.sort
      }
    });
    console.log("Admin Problem List Response:", response.data);
    return response.data;
  }
};
