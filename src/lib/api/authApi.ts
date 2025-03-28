import { apiClient } from "./apiClient";
import { TGetPreimumStatusParams, TGetPremiumStatusResponse } from "@/features/StudentOverall/types";
import { HTTPS_STATUS_CODE } from "@/constants";

export const authAPI = {
  login: async (email: string, password: string) => {
    return apiClient.post("identity/auth/login", { email, password });
  },
  signUp: async (displayName: string, email: string, password: string) => {
    return apiClient.post("identity/auth/register", { displayName, email, password });
  },
  continueWithGoogle: async (idToken: string) => {
    return apiClient.post("identity/auth/login/google", { idToken });
  },

  getPremiumStatus: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetPreimumStatusParams) => {
    const DEFAULT_ERROR = "Error getting premium information";

    if (onStart) {
      await onStart();
    }
    try {
      const response = await apiClient.get("identity/auth/premium", { params: query });
      if (response.status === HTTPS_STATUS_CODE.OK) {
        const data: TGetPremiumStatusResponse = response.data;
        onSuccess(data);
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
