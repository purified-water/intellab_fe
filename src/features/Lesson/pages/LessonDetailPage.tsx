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

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [nextLessonOrder, setNextLessonOrder] = useState<number | null>(null);
  const [nextLesson, setNextLesson] = useState<ILesson | null>(null);
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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

      // console.log("Lesson detail", result);
      setLesson(result);
    }
  };

  const getLessonQuiz = async () => {
    try {
      const response = await courseAPI.getLessonQuiz(id!);
      const result = response.result;
      console.log("Quiz", result);
      setQuiz(result);
    } catch (error) {
      console.log("Error fetching quiz", error);
    }
  };

  const handleLessonDoneCallback = async (isCorrect: boolean) => {
    setIsCorrect(isCorrect);
    try {
      if (isCorrect) {
        const response = await courseAPI.updateTheoryDone(lesson!.learningId!);
        setIsLessonDone(true);
        console.log("Lesson with quiz done", response);
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
      setIsCorrect(null);
      setIsLessonDone(false);
      setIsScrolledToBottom(false);
      setLesson(null);
      window.scrollTo(0, 0);
      navigate(`/lesson/${nextLesson.lessonId}`);
    }
  };

  useEffect(() => {
    if (quiz) {
      if (isCorrect === true) {
        handleLessonDoneCallback(true);
      } else if (isCorrect === false) {
        getLessonQuiz();
      }
    } else {
      if (isScrolledToBottom) {
        console.log("Lesson done without quiz");
        courseAPI.updateTheoryDone(lesson!.learningId!);
        setIsLessonDone(true);
      }
    }
  }, [isCorrect, isScrolledToBottom]);

  useEffect(() => {
    getLessonDetail();
    if (id) {
      getLessonQuiz();

      const timer = setTimeout(() => {
        fetchNextLesson();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [id, lesson?.courseId]);

  const renderHeader = () => {
    return (
      <div className="py-4 space-y-2 border-b border-gray4">
        <p className="text-5xl font-bold">{lesson?.lessonName}</p>
        <p className="text-gray3 line-clamp-4">{lesson?.description}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (lesson && lesson.content != null) {
      return <MarkdownRender content={lesson!.content!} setIsScrolledToBottom={setIsScrolledToBottom} />;
    }
  };

  const renderQuiz = () => {
    if (!quiz) {
      return null;
    }
    return (
      <div className="space-y-4">
        <p className="text-4xl font-bold">Quiz</p>
        <LessonQuiz quiz={quiz} lessonId={id!} answerCallback={handleLessonDoneCallback} />
      </div>
    );
  };

  const renderNextLesson = () => {
    return (
      nextLesson &&
      isLessonDone && (
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
      )
    );
  };

  return (
    <div className="p-5 px-20 space-y-8">
      {renderHeader()}
      {renderContent()}
      {renderQuiz()}
      {renderNextLesson()}
    </div>
  );
};
