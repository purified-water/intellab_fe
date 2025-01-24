//import { apiClient } from "./apiClient";
import { IGetLeaderboardResponse } from "@/pages/HomePage/types/responseTypes";

export const leaderboardAPI = {
  getLeaderboard: async () => {
    // const response = await apiClient.get("leaderboard");
    // const data: IGetLeaderboardResponse = response.data;
    const data: IGetLeaderboardResponse = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          result: {
            content: [
              {
                rank: 1,
                name: "Hoàng Quốc",
                score: 100
              },
              {
                rank: 2,
                name: "Hoàng Quốc 2",
                score: 90
              },
              {
                rank: 3,
                name: "Hoàng Quốc 3",
                score: 80
              }
            ]
          }
        });
      }, 1000);
    });
    return data.result;
  }
};
