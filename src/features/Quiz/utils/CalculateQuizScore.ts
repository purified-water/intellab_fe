import { IQuiz } from "../types/QuizType";
/**
 * Calculates the user score and returns the grade in percentage.
 * @param selectedAnswers - Record of selected answers by the user.
 * @param quizzes - List of quizzes with correct answers.
 * @returns { userGrade: number; correctAnswersCount: number; results: Record<string, boolean> }
 */
export const calculateUserScore = (selectedAnswers: Record<string, number | null>, quizzes: IQuiz[]) => {
  const results: Record<string, boolean> = {};
  quizzes.forEach((quiz) => {
    results[quiz.questionId] = (selectedAnswers?.[quiz.questionId] ?? "").toString() === quiz.correctAnswer;
  });

  const correctAnswersCount = Object.values(results).filter((result) => result).length;
  const userGrade = parseFloat(((correctAnswersCount / quizzes.length) * 100).toFixed(2));

  return { userGrade, correctAnswersCount, results };
};
