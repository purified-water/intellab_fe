import { apiClient } from "./apiClient";
import { TGetPremiumStatusParams, TGetPremiumStatusResponse } from "@/features/StudentOverall/types";
import { TResetPasswordParams, TResentVerificationEmailParams } from "@/features/Auth/types/apiType";
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

  getPremiumStatus: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetPremiumStatusParams) => {
    const DEFAULT_ERROR = "Error getting premium information";

    if (onStart) {
      await onStart();
    }
    try {
      const response = await apiClient.get("identity/auth/premium", { params: query });
      if (response.status === HTTPS_STATUS_CODE.OK) {
        const data: TGetPremiumStatusResponse = response.data;
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
  },

  resetPassword: async ({ body, onStart, onSuccess, onFail, onEnd }: TResetPasswordParams) => {
    const DEFAULT_ERROR = "Failed to send reset password link";

    if (onStart) {
      await onStart();
    }
    try {
      const email = body!.email;
      const response = await apiClient.post("identity/auth/reset-password", email, {
        headers: {
          "Content-Type": "text/plain"
        }
      });

      if (response.status === HTTPS_STATUS_CODE.OK) {
        await onSuccess(true);
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
  },

  resendVerificationEmail: async ({ body, onStart, onSuccess, onFail, onEnd }: TResentVerificationEmailParams) => {
    const DEFAULT_ERROR = "Failed to send verification email";

    if (onStart) {
      await onStart();
    }
    try {
      const email = body!.email;
      const response = await apiClient.post("identity/auth/resend-verification-email", email, {
        headers: {
          "Content-Type": "text/plain"
        }
      });

      if (response.status === HTTPS_STATUS_CODE.OK) {
        await onSuccess(true);
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
