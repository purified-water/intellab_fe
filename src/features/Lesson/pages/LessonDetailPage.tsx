import { MarkdownRender } from "../components";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ILesson } from "@/features/Course/types";
import { getUserIdFromLocalStorage } from "@/utils";
import { IQuiz } from "../types/QuizType";
import { LessonQuiz } from "../components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { Skeleton } from "@/components/ui/skeleton";

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextLessonOrder, setNextLessonOrder] = useState<number | null>(null);
  const [nextLesson, setNextLesson] = useState<ILesson | null>(null);
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  // Leave this here in case test case where there are questions in 2 consecutive lessons
  // const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState<boolean>(false);
  const [isLessonDone, setIsLessonDone] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const userId = getUserIdFromLocalStorage();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, []);

  const getLessonDetail = async () => {
    if (id && userId) {
      const response = await courseAPI.getLessonDetail(id, userId);
      const { result } = response;

      setNextLessonOrder(result.lessonOrder! + 1);
      setLesson(result);
      setLoading(false);
    }
  };

  const getLessonQuiz = async () => {
    try {
      const response = await courseAPI.getLessonQuiz(id!);
      const result = response.result;

      setQuiz(result); // If no quiz, this will remain `null`
    } catch (error) {
      console.log("Error fetching quiz", error);
    }
  };

  const handleLessonDoneCallback = async (isCorrect: boolean) => {
    // setIsCorrect(isCorrect);
    try {
      if (isCorrect || (!quiz && isScrolledToBottom)) {
        await courseAPI.updateTheoryDone(lesson!.learningId!);
        setIsLessonDone(true);
      }
    } catch (error) {
      console.log("Error updating theory done", error);
    }
  };

  const fetchNextLesson = async () => {
    try {
      if (nextLessonOrder == null || lesson?.courseId == null) {
        return;
      }

      const response = await courseAPI.getLessons(lesson!.courseId!);
      const { result } = response;
      const content = result.content;

      if (nextLessonOrder > content.length) {
        setNextLesson(null);
      } else {
        const nextLesson = content.find((lesson: ILesson) => lesson.lessonOrder === nextLessonOrder);
        setNextLesson(nextLesson!);
      }
    } catch (error) {
      console.log("Error fetching next lesson", error);
    }
  };

  const navigateToNextLesson = () => {
    if (nextLesson) {
      // setIsCorrect(null);
      setIsLessonDone(false);
      setIsScrolledToBottom(false);
      setLesson(null);
      window.scrollTo(0, 0);
      navigate(`/lesson/${nextLesson.lessonId}`);
    } else {
      fetchNextLesson();
    }
  };

  const navigateToCourse = () => {
    navigate(`/course/${lesson?.courseId}`);
  };

  useEffect(() => {
    if (lesson) {
      getLessonQuiz();
      fetchNextLesson();
    }
  }, [lesson]);

  useEffect(() => {
    getLessonDetail();
  }, [id]);

  useEffect(() => {
    if (!quiz && isScrolledToBottom) {
      handleLessonDoneCallback(true); // If no quiz, mark lesson as done when scrolled to bottom
    }
  }, [quiz, isScrolledToBottom]);

  const renderHeader = () => (
    <div className="py-4 space-y-2 border-b border-gray4">
      <p className="text-5xl font-bold">{lesson?.lessonName}</p>
      <p className="text-gray3 line-clamp-4">{lesson?.description}</p>
    </div>
  );

  const renderContent = () => {
    if (lesson && lesson.content != null) {
      return <MarkdownRender content={lesson.content} setIsScrolledToBottom={setIsScrolledToBottom} />;
    }
  };

  const renderQuiz = () => {
    if (!quiz) return null;
    return (
      <div className="space-y-4">
        <p className="text-4xl font-bold">Quiz</p>
        <LessonQuiz quiz={quiz} lessonId={id!} answerCallback={handleLessonDoneCallback} />
      </div>
    );
  };

  const renderNextLesson = () => {
    if (!nextLesson || !isLessonDone) return null;

    return (
      <div
        className="flex items-center gap-2 px-3 py-3 cursor-pointer border-y border-gray4 max-w-7xl"
        onClick={navigateToNextLesson}
      >
        <p>Continue to next Lesson:</p>
        <p className="font-bold">{nextLesson.lessonName}</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderFinishLesson = () => {
    if (nextLesson) return null;
    return (
      <div
        className="flex items-center gap-2 px-3 py-3 cursor-pointer border-y border-gray4 max-w-7xl"
        onClick={navigateToCourse}
      >
        <p>Finish Course</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="space-y-8 ">
        <Skeleton className="h-20 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="w-24 h-8 bg-gray5" />
      </div>
    );
  };

  return (
    <div className="p-5 px-6 space-y-8 sm:px-20">
      {loading ? (
        renderSkeleton()
      ) : (
        <>
          {renderHeader()}
          {renderContent()}
          {renderQuiz()}
          {renderNextLesson()}
          {renderFinishLesson()}
        </>
      )}
    </div>
  );
};
