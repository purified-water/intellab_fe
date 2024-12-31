import { apiClient } from "./apiClient";

export const authAPI = {
  login: async (email: string, password: string) => {
    return apiClient.post("identity/auth/login", { email, password });
  },
  signUp: async (displayName: string, email: string, password: string) => {
    return apiClient.post("identity/auth/register", { displayName, email, password });
  },
  continueWithGoogle: async (idToken: string) => {
    return apiClient.post("identity/auth/login/google", { idToken });
  }
};
