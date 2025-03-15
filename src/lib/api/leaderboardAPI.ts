import { apiClient } from "./apiClient";
import { TGetLeaderboardResponse } from "@/features/Leaderboard/types/apiResponseType";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;

export const leaderboardAPI = {
  getLeaderboard: async (filter: string, page = DEFAULT_PAGE, size = DEFAULT_PAGE_SIZE) => {
    const queryParams = {
      filter,
      page,
      size
    };

    const response = await apiClient.get("identity/leaderboard", { params: queryParams });
    const data: TGetLeaderboardResponse = response.data;
    return data;
  }
};
