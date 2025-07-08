import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { IQuiz } from "@/features/Quiz/types/QuizType";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ChevronLeft } from "lucide-react";
import { calculateUserScore } from "@/features/Quiz/utils/CalculateQuizScore";
import { SEO } from "@/components/SEO";

export const AdminQuizPreview = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>({});
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userGrade, setUserGrade] = useState<number | null>(null);

  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const lessonName = searchParams.get("lessonName") || "Quiz Preview";

  const NUMBER_OF_QUESTIONS = 10;

  const handleAnswerSelection = (questionId: string, order: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: order
    }));
  };

  const fetchQuizzes = async () => {
    if (!lessonId) return;

    setIsLoading(true);
    try {
      const response = await courseAPI.getLessonQuiz(lessonId, NUMBER_OF_QUESTIONS, 0);
      const result = response.result;

      setQuizzes(result);
      setSelectedAnswers(Object.fromEntries(result.map((quiz: IQuiz) => [quiz.questionId, null])));
    } catch (error) {
      console.error("Error fetching quizzes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const { userGrade, results } = calculateUserScore(selectedAnswers, quizzes);

    setSubmittedAnswers(results);
    setUserGrade(userGrade);
    setIsSubmitted(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedAnswers({});
    setSelectedAnswers(Object.fromEntries(quizzes.map((quiz: IQuiz) => [quiz.questionId, null])));
    setUserGrade(null);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  const renderQuizHeader = () => (
    <div className="mb-6">
      <div className="flex items-center gap-1 mb-4" onClick={() => window.close()}>
        <ChevronLeft className="cursor-pointer text-appPrimary" size={22} />
        <div className="text-xl font-bold text-appPrimary">Back</div>
      </div>
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">{lessonName} - Quiz Preview</h1>
        <p className="text-gray-600">Admin Preview Mode - Results are for preview only</p>
        {isSubmitted && (
          <div
            className={`p-4 mt-4 border rounded-lg ${
              userGrade === null
                ? "border-gray-200 bg-gray-50 text-gray2"
                : userGrade >= 70
                  ? "border-appEasy bg-green-50 text-appEasy"
                  : "border-appHard bg-red-50 text-appHard"
            }`}
          >
            <div className="text-lg font-semibold">Score: {userGrade !== null ? `${userGrade}%` : "N/A"}</div>
            <div className="mt-1 text-sm">
              {userGrade !== null && userGrade >= 70
                ? "Passing Grade ✓"
                : userGrade !== null
                  ? "Below Passing Grade (70% required)"
                  : "No grade available"}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="w-full max-w-3xl p-6 mx-auto">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-12">
          <Skeleton className="w-3/4 h-6 mb-4" />
          <ul className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="flex items-center space-x-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="w-1/2 h-4" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderQuizContent = () => (
    <div className="w-full max-w-3xl p-6 mx-auto">
      {quizzes.map((quiz, index) => (
        <div key={quiz.questionId} className="mb-12">
          <p className="mb-4 text-lg font-semibold">
            {index + 1}. {quiz.questionContent}
          </p>
          <ul className="space-y-3">
            {quiz.options.map((option) => (
              <li key={option.order} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`quiz-${quiz.questionId}-option-${option.order}`}
                  name={`quiz-${quiz.questionId}`}
                  value={option.order}
                  checked={selectedAnswers[quiz.questionId] === option.order}
                  onChange={() => handleAnswerSelection(quiz.questionId, option.order)}
                  className="w-4 h-4 rounded-full appearance-none cursor-pointer bg-gray5 checked:bg-appPrimary"
                  disabled={isSubmitted}
                />
                <label htmlFor={`quiz-${quiz.questionId}-option-${option.order}`} className="flex-1 cursor-pointer">
                  {option.content}
                </label>
              </li>
            ))}
          </ul>

          {isSubmitted && submittedAnswers[quiz.questionId] !== undefined && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg text-sm ${
                submittedAnswers[quiz.questionId]
                  ? "bg-green-50 text-appEasy border border-appEasy"
                  : "bg-red-50 text-appHard border border-appHard"
              }`}
            >
              <div className="font-bold">{submittedAnswers[quiz.questionId] ? "✓ Correct" : "✗ Incorrect"}</div>
              <div className="mt-1 text-xs">
                Correct answer: {quiz.options.find((opt) => opt.order.toString() === quiz.correctAnswer)?.content}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-center mt-8 space-x-4">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.values(selectedAnswers).some((answer) => answer === null)}
            className="text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
          >
            Submit Quiz (Preview)
          </Button>
        ) : (
          <Button
            onClick={handleReset}
            className="bg-white border-2 text-appPrimary border-appPrimary hover:bg-appPrimary/10"
          >
            Reset Quiz
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <SEO title="Quiz Preview | Intellab" />
      <div className="container py-8 mx-auto">
        {renderQuizHeader()}
        {isLoading ? renderSkeleton() : renderQuizContent()}
      </div>
    </div>
  );
};
