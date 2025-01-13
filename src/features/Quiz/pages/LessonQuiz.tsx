import { useState } from "react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ChevronLeft } from "lucide-react";
import { QuizResult } from "../components/QuizResult";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { courseAPI } from "@/lib/api";
import { useParams } from "react-router-dom";
import { IQuiz } from "../types/QuizType";
import { QuizHeader } from "../components/QuizHeader";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { saveQuizDraft, loadQuizDraft, clearQuizDraft } from "@/utils/courseLocalStorage";

export const LessonQuiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>();
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const lessonId = useParams<{ lessonId: string }>().lessonId;
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const learningId = searchParams.get("learningId");
  const navigate = useNavigate();
  const NUMBER_OF_QUESTIONS = 10;

  const handleAnswerSelection = (questionId: string, order: number) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: order };
      if (lessonId) {
        saveQuizDraft(lessonId, updatedAnswers); // Save using the utility
      }
      return updatedAnswers;
    });
  };

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      if (!lessonId) return;
      const response = await courseAPI.getLessonQuiz(lessonId, NUMBER_OF_QUESTIONS, false); // False to get quiz first time
      const result = response.result;

      setQuizzes(result);
      const savedDraft = loadQuizDraft(lessonId);
      if (savedDraft && Object.keys(savedDraft).length > 0) {
        setSelectedAnswers(savedDraft);
      } else {
        setSelectedAnswers(Object.fromEntries(result.map((quiz: IQuiz) => [quiz.questionId, null])));
      }
    } catch (error) {
      console.log("Error fetching quizzes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const results: Record<string, boolean> = {};
    quizzes.forEach((quiz) => {
      results[quiz.questionId] = (selectedAnswers?.[quiz.questionId] ?? "").toString() == quiz.correctAnswer;
    });
    setSubmittedAnswers(results);

    const correctAnswersCount = Object.values(results).filter((result) => result).length;
    setIsSubmitted(true);
    if (correctAnswersCount / quizzes.length >= 0.7) {
      setIsCorrect(true);
      // Call done theory here
    } else {
      setIsCorrect(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetryOrFinish = () => {
    if (isCorrect) {
      // Navigate to next lesson
      // navigate(-1);
    } else {
      setIsSubmitted(false);
      setSubmittedAnswers({});
      setSelectedAnswers(Object.fromEntries(quizzes.map((quiz: IQuiz) => [quiz.questionId, null])));
      clearQuizDraft(lessonId!);

      fetchQuizzes();
    }
  };

  useEffect(() => {
    fetchQuizzes();

    const savedDraft = loadQuizDraft(lessonId!);
    console.log("savedDraft", savedDraft);
    if (savedDraft) {
      setSelectedAnswers(savedDraft);
    }
  }, []);

  const renderReturnToLesson = () => {
    if (!lessonId) return;

    return (
      <div className="flex items-center gap-2 mx-8 mt-4 cursor-pointer" onClick={() => navigate(-1)}>
        <ChevronLeft className="text-appPrimary" size={22} />
        <div className="text-xl font-bold text-appPrimary">Return to lesson</div>
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="w-full max-w-3xl p-6">
        {/* Skeleton for each quiz question */}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="mb-12">
            {/* Skeleton for question content */}
            <Skeleton className="w-3/4 h-5 mb-3" />
            {/* Skeleton for question options */}
            <ul className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="w-1/2 h-4" />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Skeleton for submit buttons */}
        <div className="flex items-center mt-6 space-x-4">
          <Skeleton className="w-24 h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg w-28" />
        </div>
      </div>
    );
  };

  const renderQuizContent = () => {
    return (
      <>
        {isSubmitted ? <QuizResult isCorrect={isCorrect} onClick={handleRetryOrFinish} /> : <QuizHeader />}
        <div className="w-full max-w-3xl p-6">
          {/* Questions */}
          <div className="">
            {quizzes.map((quiz, index) => (
              <div key={quiz.questionId} className="mb-12">
                <p className="mb-3 text-base font-semibold">
                  {index + 1}. {quiz.questionContent}
                </p>
                <ul className="space-y-2">
                  {quiz.options.map((option) => (
                    <li key={option.order} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`quiz-${quiz.questionId}-option-${option.order}`}
                        name={`quiz-${quiz.questionId}`}
                        value={option.order}
                        checked={selectedAnswers?.[quiz.questionId] === option.order}
                        onChange={() => handleAnswerSelection(quiz.questionId, option.order)}
                        className="w-4 h-4 rounded-full appearance-none cursor-pointer bg-gray5 checked:bg-appPrimary"
                      />
                      <label htmlFor={`quiz-${quiz.questionId}-option-${option.order}`} className="cursor-pointer">
                        {option.content}
                      </label>
                    </li>
                  ))}
                </ul>
                {submittedAnswers[quiz.questionId] !== undefined && (
                  <div
                    className={`my-2 px-4 py-2 rounded-lg text-sm ${
                      submittedAnswers[quiz.questionId] ? "bg-green-50 text-appEasy" : "bg-red-50 text-appHard"
                    }`}
                  >
                    {submittedAnswers[quiz.questionId] ? (
                      <span className="font-bold">Correct</span>
                    ) : (
                      <>
                        <span className="font-bold">Incorrect</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center mt-6 space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={Object.values(selectedAnswers ?? {}).some((answer) => answer == null)}
              className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
            >
              Submit
            </Button>

            <Button className="h-10 bg-white border rounded-lg border-appPrimary text-appPrimary hover:bg-appPrimary hover:text-white">
              Save as draft
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {renderReturnToLesson()}
      <div className="flex flex-col items-center justify-center py-6">
        {isLoading ? renderSkeleton() : renderQuizContent()}
      </div>
    </>
  );
};
