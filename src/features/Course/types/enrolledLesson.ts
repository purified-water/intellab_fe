export interface IEnrolledLesson {
  lessonId: string;
  problemId: string;
  content: string;
  description: string;
  lessonOrder: number;
  lessonName: string;
  courseId: string;
  exerciseId: string;
  status: string;
  lastAccessedDate: string;
  learningId: string;
  isDoneTheory: boolean;
  isDonePractice: boolean;
}
