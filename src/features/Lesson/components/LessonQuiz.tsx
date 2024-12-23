import { useState } from "react";
import { IQuiz } from "../types/QuizType";
import { courseAPI } from "@/lib/api";

interface QuizProps {
  quiz: IQuiz;
  lessonId: string;
}

export const LessonQuiz = (props: QuizProps) => {
  const { quiz, lessonId } = props;

  const [selectedAnswerOrder, setSelectedAnswerOrder] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [newQuiz, setNewQuiz] = useState<IQuiz | null>(quiz);

  if (newQuiz == null) {
    return;
  }

  const handleAnswerSelection = (orderNumber: number) => {
    setSelectedAnswerOrder(orderNumber);
  };

  const getLessonQuiz = async () => {
    try {
      const response = await courseAPI.getLessonQuiz(lessonId!);
      const result = response.result;

      setNewQuiz(result);
    } catch (error) {
      console.log("Error fetching quiz", error);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswerOrder?.toString() == quiz.correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedAnswerOrder(null);
        getLessonQuiz();
      }, 1500);
    }
  };

  return (
    <div className="py-5 border rounded-lg px-7 max-w-7xl">
      <p className="mb-4 text-lg font-semibold">{newQuiz.questionContent}</p>
      <ul className="space-y-2">
        {newQuiz.options.map((answer) => (
          <li key={answer.order} className="flex items-center space-x-3">
            <input
              type="radio"
              id={answer.order.toString()}
              name="quiz"
              value={answer.order}
              checked={selectedAnswerOrder == answer.order}
              onChange={() => handleAnswerSelection(answer.order)}
              className="w-4 h-4 rounded-full appearance-none cursor-pointer bg-gray5 checked:bg-appPrimary checked:border-appSecondary checked:border-1"
            />
            <label htmlFor={answer.order.toString()} className="cursor-pointer">
              {answer.content}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={!selectedAnswerOrder}
        className="px-10 py-2 mt-4 font-bold text-white rounded-lg bg-appPrimary hover:bg-appFadedPrimary"
      >
        Answer
      </button>

      {isCorrect !== null && (
        <p className={`mt-4 font-bold ${isCorrect ? "text-appEasy" : "text-appHard"}`}>
          {isCorrect ? "Correct" : "Incorrect"}
        </p>
      )}
    </div>
  );
};
