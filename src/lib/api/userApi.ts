import { apiClient } from "./apiClient";
import {
  TGetProfilePublicResponse,
  TUploadProfilePhotoResponse,
  TGetProfilesResponse,
  TGetProgressLevelResponse,
  TGetProgressLanguageResponse,
  TGetProfileResponse,
  TGetProfileMeResponse
} from "@/features/Profile/types/apiResponseType";

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

  getUserPublic: async (userId: string) => {
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
    const response = await apiClient.post("/identity/profile/single", {
      userId: userId
    });
    const data: TGetProfileResponse = response.data;
    return data;
  },

  getProfileMe: async () => {
    const response = await apiClient.get("/identity/profile/me");
    const data: TGetProfileMeResponse = response.data;
    return data;
  }
};
