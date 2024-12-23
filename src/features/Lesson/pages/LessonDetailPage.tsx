import { MarkdownRender } from "../components";
// import { IQuiz } from "@/types";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ILesson } from "@/features/Course/types";
import { IQuiz } from "../types/QuizType";
import { LessonQuiz } from "../components";

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [nextLesson, setNextLesson] = useState<ILesson | null>(null);
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem("userId");

  const getLessonDetail = async () => {
    const response = await courseAPI.getLessonDetail(id!, userId!);
    const { result } = response;
    setLesson(result);
  };

  const getLessonQuiz = async () => {
    try {
      const response = await courseAPI.getLessonQuiz(id!);
      const result = response.result;

      setQuiz(result);
    } catch (error) {
      console.log("Error fetching quiz", error);
    }
  };

  // NOTE: Temporary before API is updated
  // Get all the lesson from the course and find the next lesson (lessonOrder + 1)
  const fetchNextLesson = async () => {
    try {
      const response = await courseAPI.getLessons(lesson!.courseId!);
      const { result } = response;
      const nextLessonOrder = lesson!.lessonOrder! + 1;

      if (nextLessonOrder > result.length) {
        setNextLesson(null);
      } else {
        const nextLesson = result.find((lesson: ILesson) => lesson.lessonOrder === nextLessonOrder);
        setNextLesson(nextLesson!);
      }
    } catch (error) {
      console.log("Error fetching next lesson", error);
    }
  };

  // TO DO: Create a callback function in LessonQuiz to update the lesson state
  // If the quiz is correct, update the lesson state to completed and show the next chapter button
  // Else dont

  const navigateToNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.lessonId}`);
    }
  };

  useEffect(() => {
    getLessonDetail();
    if (lesson) {
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
      return <MarkdownRender content={lesson!.content!} />;
    }
  };

  const renderQuiz = () => {
    if (!quiz) {
      return null;
    }
    return (
      <div className="space-y-4">
        <p className="text-4xl font-bold">Quiz</p>
        <LessonQuiz quiz={quiz} lessonId={id!} />
      </div>
    );
  };

  const renderNextLesson = () => {
    return (
      nextLesson && (
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
