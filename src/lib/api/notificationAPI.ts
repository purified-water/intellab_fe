import { apiClient } from "./apiClient";
const DEFAULT_SIZE = 10;
export const notificationAPI = {
  getNotifications: async (page: number, size: number = DEFAULT_SIZE) => {
    const response = await apiClient.get(`identity/notifications?page=${page}&size=${size}&sort=timestamp,desc`);
    console.log("response", response);
    return response.data;
  },
  putMarkOneAsRead: async (notificationId: string) => {
    const response = await apiClient.put(`identity/notifications/markAsRead?notificationId=${notificationId}`);
    return response;
  },
  putMarkAllAsRead: async () => {
    const response = await apiClient.put(`identity/notifications/markAllAsRead`);
    return response;
  }
};
