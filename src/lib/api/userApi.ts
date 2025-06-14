import { apiClient } from "./apiClient";
import {
  TGetProfilePublicResponse,
  TUploadProfilePhotoResponse,
  TGetProfilesResponse,
  TGetProgressLevelResponse,
  TGetProgressLanguageResponse,
  TGetProfileResponse,
  TGetProfileMeResponse,
  TGetProfileMeParams
} from "@/features/Profile/types/apiType";
import { TGetUsersForAdminResponse, TGetUsersForAdminParams } from "@/features/Admins/features/user/types/apiType";
import { API_RESPONSE_CODE, HTTPS_STATUS_CODE } from "@/constants";
import { TPostLoginStreakResponse } from "@/features/StudentOverall/types";

const DEFAULT_PAGE_SIZE = 10;

export const userAPI = {
  updateProfile: async (
    displayName: string | null,
    firstName: string | null,
    lastName: string | null,
    password: string | null
  ) => {
    const response = await apiClient.put("identity/profile/update", {
      displayName: displayName,
      firstName: firstName,
      lastName: lastName,
      password: password
    });
    return response;
  },

  getProfilePublic: async (userId: string) => {
    const response = await apiClient.post("/identity/profile/single/public", {
      userId: userId
    });
    const data: TGetProfilePublicResponse = response.data;
    return data;
  },

  uploadProfilePhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/identity/profile/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    const data: TUploadProfilePhotoResponse = response.data;
    return data;
  },

  getProfiles: async (userIds: string[]) => {
    const response = await apiClient.post("/identity/profile/multiple", {
      userIds: userIds
    });
    const data: TGetProfilesResponse = response.data;
    return data;
  },

  getProgressLevel: async (userId: string | null) => {
    const queryParams = {
      userId: userId
    };
    const response = await apiClient.get("/problem/statistics/progress/level", {
      params: queryParams
    });
    const data: TGetProgressLevelResponse = response.data;
    return data;
  },

  getProgressLanguage: async (userId: string | null) => {
    const queryParams = {
      userId: userId
    };
    const response = await apiClient.get("/problem/statistics/progress/language", {
      params: queryParams
    });
    const data: TGetProgressLanguageResponse = response.data;
    return data;
  },

  getProfile: async (userId: string) => {
    const queryParams = {
      userId
    };
    const response = await apiClient.get("/identity/profile/single", { params: queryParams });
    const data: TGetProfileResponse = response.data;
    return data;
  },

  getProfileMe: async ({ onStart, onSuccess, onFail, onEnd }: TGetProfileMeParams) => {
    const DEFAULT_ERROR = "Error getting user profile";

    if (onStart) {
      await onStart();
    }
    try {
      const response = await apiClient.get("/identity/profile/me");
      if (response.status === HTTPS_STATUS_CODE.OK) {
        const data: TGetProfileMeResponse = response.data;
        await onSuccess(data);
      } else {
        await onFail(DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getUsersForAdmin: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetUsersForAdminParams) => {
    const DEFAULT_ERROR = "Error getting users for admin";

    if (onStart) {
      await onStart();
    }
    try {
      const { keyword, page } = query!;
      const response = await apiClient.get("/identity/admin/profile/list-users", {
        params: {
          keyword: keyword,
          page: page,
          size: DEFAULT_PAGE_SIZE
        }
      });
      const data: TGetUsersForAdminResponse = response.data;

      const { code, result, message } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    }
    if (onEnd) {
      setTimeout(() => {
        onEnd();
      }, 1000);
    }
  },

  postLoginStreak: async (): Promise<TPostLoginStreakResponse> => {
    const response = await apiClient.post("/identity/profile/loginStreak");
    if (response.status === HTTPS_STATUS_CODE.OK) {
      return response.data;
    }
    throw new Error("Error posting login streak");
  }
};
