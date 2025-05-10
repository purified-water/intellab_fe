import { ICourse } from "@/types";

export interface ICreateCourse extends ICourse {
  summaryContent: string;
} // Not yet used; used schemas instead

export interface ILessonResponse {
  lessonId: string;
  lessonName: string;
  description: string;
  content: string;
  lessonOrder: number;
  courseId: string;
  problemId: string | null;
  quizId: string | null;
}
