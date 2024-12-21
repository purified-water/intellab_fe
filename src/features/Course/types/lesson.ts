export interface ILesson {
  lessonId: string;
  lessonOrder: number;
  lessonName: string;
  description: string;
  content: string;
  courseId: string;
  exerciseId: string;
  finishTheory: boolean;
  finishExercise: boolean;
}
