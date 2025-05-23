import { USER_ROLES } from "@/constants";

export const isAdmin = (userRole?: string): boolean => {
  return userRole === USER_ROLES.ADMIN;
};

export const hasAdminAccess = (userRole?: string): boolean => {
  return isAdmin(userRole);
};
