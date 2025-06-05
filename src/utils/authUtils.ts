import { USER_ROLES } from "@/constants";
import Cookies from "js-cookie";

export const isAdmin = (userRole?: string): boolean => {
  return userRole === USER_ROLES.ADMIN;
};

export const hasAdminAccess = (userRole?: string): boolean => {
  return isAdmin(userRole);
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get("accessToken");
};
