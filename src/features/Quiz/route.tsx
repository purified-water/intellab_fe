import { LessonQuiz } from "./pages";
import { RouteObject } from "react-router-dom";

const QuizRoute: RouteObject[] = [
  {
    path: "lesson/:lessonId/quiz/:quizId",
    element: <LessonQuiz />
  }
];

export default QuizRoute;
