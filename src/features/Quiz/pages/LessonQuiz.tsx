import { useState } from "react";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { ChevronLeft } from "lucide-react";
import { QuizResult } from "../components/QuizResult";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { courseAPI } from "@/lib/api";
import { useParams } from "react-router-dom";
import { IQuiz, IQuizResponse } from "../types/QuizType";
import { QuizHeader } from "../components/QuizHeader";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { saveQuizDraft, loadQuizDraft, clearQuizDraft } from "@/utils/courseLocalStorage";
import { getUserIdFromLocalStorage } from "@/utils";
import { calculateUserScore } from "../utils/CalculateQuizScore";

export const LessonQuiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | null>>();
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const lessonId = useParams<{ lessonId: string }>().lessonId;
  const quizId = useParams<{ quizId: string }>().quizId;
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const learningId = searchParams.get("learningId");
  const isDone = searchParams.get("isDone");
  const navigate = useNavigate();
  const NUMBER_OF_QUESTIONS = 10;
  const userId = getUserIdFromLocalStorage();
  const [userGrade, setUserGrade] = useState<number | null>(null);

  const handleAnswerSelection = (questionId: string, order: number) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: order };
      saveQuizDraft(lessonId!, updatedAnswers);
      return updatedAnswers;
    });
    console.log("selectedAnswers", selectedAnswers);
  };

  const fetchQuizzes = async (isDone: number | null) => {
    setIsLoading(true);
    try {
      if (!lessonId) return;
      const response = await courseAPI.getLessonQuiz(lessonId, NUMBER_OF_QUESTIONS, isDone); // False to get quiz first time
      const result = response.result;
      console.log("Quizzes", result);
      setQuizzes(result);

      // Handle when fix the error of options order is null when isDone is true
      // if (isDone !== null) {
      //   setSubmittedAnswers(Object.fromEntries(result.map((quiz: IQuizResponse) => [quiz.questionId, quiz.answer])));
      // }
      // Handle when havent fixed the error
      // const savedDraft = loadQuizDraft(lessonId);
      // if (savedDraft && Object.keys(savedDraft).length > 0) {
      //   setSelectedAnswers(savedDraft);
      // }

      if (isDone !== null) {
        console.log("isDone is not null, processing result:", result);
        const updatedAnswers = Object.fromEntries(
          result.map((quiz: IQuizResponse) => [quiz.questionId.toString(), parseInt(quiz.answer)])
        );

        setSelectedAnswers(updatedAnswers);
      } else {
        setSelectedAnswers(Object.fromEntries(result.map((quiz: IQuiz) => [quiz.questionId, null])));
      }
    } catch (error) {
      console.log("Error fetching quizzes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmitQuiz = async (correctAnswersCount: number) => {
    if (!lessonId || !learningId) return;

    const assignmentDetailRequests = Object.entries(selectedAnswers ?? {}).map(([questionId, answer]) => {
      return {
        answer: answer?.toString() ?? "",
        unitScore: 1,
        questionId
      };
    });

    console.log("assignmentDetailRequests", assignmentDetailRequests);
    try {
      await courseAPI.postSubmitQuiz(lessonId, {
        score: correctAnswersCount,
        exerciseId: quizId ?? "",
        learningId: learningId,
        assignmentDetailRequests
      });
    } catch (error) {
      console.error("Failed to submit quiz", error);
    }
  };

  const handleSubmit = () => {
    console.log("Selected answers", selectedAnswers);
    const { userGrade, correctAnswersCount, results } = calculateUserScore(selectedAnswers ?? {}, quizzes);

    setSubmittedAnswers(results);
    setUserGrade(userGrade);
    setIsSubmitted(true);

    if (correctAnswersCount / quizzes.length >= 0.7) {
      setIsCorrect(true);
      handlePostSubmitQuiz(correctAnswersCount);

      // Update theory done
      courseAPI.updateTheoryDone(learningId!, courseId!, userId!);
    } else {
      setIsCorrect(false);
      handlePostSubmitQuiz(correctAnswersCount);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadDraft = () => {
    const savedDraft = loadQuizDraft(lessonId!);

    if (savedDraft) {
      setSelectedAnswers(savedDraft);
    }
  };

  const handleRetryOrFinish = () => {
    if (isCorrect) {
      navigate(`/course/${courseId}`);
    } else {
      setIsSubmitted(false);
      setSubmittedAnswers({});
      setSelectedAnswers(Object.fromEntries(quizzes.map((quiz: IQuiz) => [quiz.questionId, null])));
      clearQuizDraft(lessonId!);

      fetchQuizzes(0);
    }
  };

  useEffect(() => {
    // Implement after fixing the error: options order is null when fetching quizzes after user has passed it
    if (isDone === "true") {
      fetchQuizzes(1);
    } else if (isDone === "false") {
      fetchQuizzes(1);
    } else {
      fetchQuizzes(0);
      loadDraft();
    }
  }, [isDone]);

  useEffect(() => {
    if (selectedAnswers && isDone === "true") {
      const { userGrade, correctAnswersCount, results } = calculateUserScore(selectedAnswers, quizzes);
      setSubmittedAnswers(results);
      if (correctAnswersCount / quizzes.length >= 0.7) {
        setIsSubmitted(true);
        setIsCorrect(true);
        setUserGrade(userGrade);
      }
    }
  }, [selectedAnswers, isDone]);

  const renderReturnToLesson = () => {
    if (!lessonId) return;

    return (
      <div
        className="flex items-center gap-2 mx-8 mt-4 cursor-pointer"
        onClick={() => {
          navigate(`/course/${courseId}`);
        }}
      >
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
        {isSubmitted ? (
          <QuizResult isCorrect={isCorrect} onClick={handleRetryOrFinish} grade={userGrade} />
        ) : (
          <QuizHeader />
        )}
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
                        disabled={isSubmitted}
                      />
                      <label htmlFor={`quiz-${quiz.questionId}-option-${option.order}`} className="cursor-pointer">
                        {option.content}
                      </label>
                    </li>
                  ))}
                </ul>

                {submittedAnswers[quiz.questionId] !== undefined && submittedAnswers[quiz.questionId] !== null && (
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
          {isDone !== "true" && (
            <div className="flex items-center mt-6 space-x-4">
              <Button
                onClick={handleSubmit}
                disabled={Object.values(selectedAnswers ?? {}).some((answer) => answer == null)}
                className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
              >
                Submit
              </Button>
            </div>
          )}
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
