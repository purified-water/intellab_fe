import { ICourse } from "@/types";

export interface ReduxCourse {
  courseId: string | null;
  userEnrolled: boolean;
}
export interface CourseState {
  courses: ReduxCourse[];
  exploreCourses: ICourse[];
  originalExploreCourses: ICourse[];
  hasFilter: boolean;
}
