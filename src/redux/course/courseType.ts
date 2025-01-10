import { ICourse } from "@/features/Course/types";

export interface ReduxCourse {
  courseId: string | null;
  userEnrolled: boolean;
}
export interface CourseState {
  courses: ReduxCourse[];
  exploreCourses: ICourse[];
  originalExploreCourses: ICourse[];
}
