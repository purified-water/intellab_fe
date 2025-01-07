export interface ILesson {
  lessonId: string;
  content: string;
  description: string;
  lessonOrder: number;
  lessonName: string;
  courseId: string;
  exerciseId: string;
  problemId: string;
  learningId: string;
  nextLessonId: string;
  nextLessonName: string;
  isDoneTheory: boolean;
  isDonePractice: boolean;
}
