export interface ReduxCourse {
  courseId: string | null;
  userEnrolled: boolean;
}
export interface CourseState {
  courses: ReduxCourse[];
}
