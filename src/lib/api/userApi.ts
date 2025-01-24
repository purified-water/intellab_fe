//import { apiClient } from "./apiClient";
import { UserType } from "@/types";
import { IGetProgressResponse } from "@/pages/HomePage/types/responseTypes";

export const userAPI = {
  getUser: async (userId: string) => {
    // const response = await apiClient.get(`user/users/${userId}`);
    // const data: UserType = response.data;
    // return data;
    const data: UserType = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          username: "Hoàng Quốc"
        });
      }, 1000);
    });
    return data;
  },
  getProgress: async (userId: string) => {
    // const response = await apiClient.get(`user/users/${userId}/progress`);
    // const data: IGetProgressResponse = response.data;
    // return data;
    const data: IGetProgressResponse = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          result: {
            totalQuestions: 100,
            easySolved: 10,
            mediumSolved: 10,
            hardSolved: 5,
            easyMax: 50,
            mediumMax: 30,
            hardMax: 20
          }
        });
      }, 1000);
    });
    return data.result;
  }
};
