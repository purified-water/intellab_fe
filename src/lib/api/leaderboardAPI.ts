import { apiClient } from "./apiClient";
import { TGetLeaderboardResponse, TGetLeaderboardParams } from "@/features/Leaderboard/types/apiType";
import { HTTPS_STATUS_CODE } from "@/constants";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 20;

export const leaderboardAPI = {
  getLeaderboard: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetLeaderboardParams) => {
    const DEFAULT_ERROR = "Failed to get leaderboard data";

    if (onStart) {
      await onStart();
    }
    try {
      const response = await apiClient.get("identity/leaderboard", {
        params: {
          filter: query?.filter,
          page: query?.page ?? DEFAULT_PAGE,
          size: query?.size ?? DEFAULT_PAGE_SIZE
        }
      });
      if (response.status === HTTPS_STATUS_CODE.OK) {
        const data: TGetLeaderboardResponse = response.data;
        await onSuccess(data);
      } else {
        await onFail(DEFAULT_ERROR);
      }
    } catch (error) {
      await onFail(error.message ?? DEFAULT_ERROR);
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  }
};
