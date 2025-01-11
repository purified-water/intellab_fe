import { useState } from "react";
import { IQuiz } from "../types/QuizType";
import { courseAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface QuizProps {
  quiz: IQuiz;
  lessonId: string;
  answerCallback: (isCorrect: boolean) => void;
}

export const LessonQuiz = (props: QuizProps) => {
  const { quiz, lessonId, answerCallback } = props;
  const [loading, setLoading] = useState(false);
  const [selectedAnswerOrder, setSelectedAnswerOrder] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<IQuiz>(quiz);

  const handleAnswerSelection = (orderNumber: number) => {
    setSelectedAnswerOrder(orderNumber);
  };

  const fetchNewQuiz = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getLessonQuiz(lessonId);
      const result = response.result;

      setCurrentQuiz(result);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching new quiz", error);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswerOrder?.toString() === currentQuiz.correctAnswer) {
      setIsCorrect(true);
      answerCallback(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedAnswerOrder(null);
        fetchNewQuiz();
      }, 1000);
    }
  };

  const renderSkeleton = () => {
    return (
      <div className="py-5 border rounded-lg px-7 max-w-7xl">
        <Skeleton className="w-1/2 h-4 mb-4" />
        <ul className="space-y-2">
          {[1, 2, 3, 4].map((order) => (
            <li key={order} className="flex items-center space-x-3">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-12 h-4" />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return loading ? (
    renderSkeleton()
  ) : (
    <div className="py-5 border rounded-lg px-7 max-w-7xl sm:w-[85%]">
      <p className="mb-4 text-lg font-semibold">{currentQuiz.questionContent}</p>
      <ul className="space-y-2">
        {currentQuiz.options.map((answer) => (
          <li key={answer.order} className="flex items-center space-x-3">
            <input
              type="radio"
              id={answer.order.toString()}
              name="quiz"
              value={answer.order}
              checked={selectedAnswerOrder === answer.order}
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
