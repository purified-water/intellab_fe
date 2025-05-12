export const ADMIN_COURSE_VIEW_TYPES = {
  CREATE: "create",
  VIEW: "view",
  EDIT: "edit"
} as const;

export type AdminCourseViewTypes = (typeof ADMIN_COURSE_VIEW_TYPES)[keyof typeof ADMIN_COURSE_VIEW_TYPES];
