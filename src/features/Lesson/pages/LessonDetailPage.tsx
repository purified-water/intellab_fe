// import { MarkdownRender } from "../components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ILesson, ICourse } from "@/features/Course/types";
import { clearBookmark, getUserIdFromLocalStorage } from "@/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Button } from "@/components/ui/shadcn/Button";
import { MarkdownRender } from "../components/MarkdownRender2";

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextLessonOrder, setNextLessonOrder] = useState<number | null>(null);
  const [nextLesson, setNextLesson] = useState<ILesson | null>(null);
  const [hasQuiz, setHasQuiz] = useState<boolean>(false);

  // Leave this here in case test case where there are questions in 2 consecutive lessons
  // const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState<boolean>(false);
  const [isLessonDone, setIsLessonDone] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const userId = getUserIdFromLocalStorage();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // Get learning id, course id from query params
  const [searchParams] = useSearchParams();
  const learningId = searchParams.get("learningId");
  const courseId = searchParams.get("courseId");
  const [course, setCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const getCourseDetail = async () => {
    if (courseId) {
      try {
        const response = await courseAPI.getCourseDetail(courseId, userId!);
        const { result } = response;

        setCourse(result);
      } catch (error) {
        console.log("Error fetching course detail", error);
      }
    }
  };

  const getLessonDetail = async () => {
    if (id && userId) {
      if (learningId && courseId) {
        try {
          await courseAPI.updateLessonLearningProgress(learningId, courseId, userId);
        } catch (error) {
          console.log("Error updating learning progress", error);
        }
      }
      const response = await courseAPI.getLessonDetail(id, userId);
      const { result } = response;
      console.log("Lesson detail", result);
      setNextLessonOrder(result.lessonOrder! + 1);
      setLesson(result);

      if (lesson?.exerciseId) {
        setHasQuiz(true);
      }

      setLoading(false);
    }
  };

  // const getLessonQuiz = async () => {
  //   try {
  //     const response = await courseAPI.getLessonQuiz(id!);
  //     const result = response.result;

  //     setQuiz(result); // If no quiz, this will remain `null`
  //   } catch (error) {
  //     console.log("Error fetching quiz", error);
  //   }
  // };

  const handleLessonDoneCallback = async (isCorrect: boolean) => {
    // setIsCorrect(isCorrect);
    try {
      if (isCorrect || (!hasQuiz && isScrolledToBottom)) {
        await courseAPI.updateTheoryDone(lesson!.learningId!, lesson!.courseId!, userId!);
        // Remove bookmark after lesson is done
        clearBookmark(userId!, lesson!.lessonId!);

        await courseAPI.updatePracticeDone(lesson!.learningId!, lesson!.courseId, userId!); // TEMPORARY MARK AS DONE for practice because no practice yet
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

      const response = await courseAPI.getLessons(lesson!.courseId!, 100);
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

  const navigateToProblem = () => {
    navigate(
      `/problems/${lesson!.problemId}?lessonId=${lesson!.lessonId}&lessonName=${lesson!.lessonName}&courseId=${course!.courseId}&courseName=${course!.courseName}`
    );
  };

  useEffect(() => {
    if (lesson) {
      // getLessonQuiz();
      fetchNextLesson();
    }
  }, [lesson]);

  useEffect(() => {
    getCourseDetail();
    getLessonDetail();
  }, [id]);

  useEffect(() => {
    if (!hasQuiz && isScrolledToBottom) {
      handleLessonDoneCallback(true); // If no quiz, mark lesson as done when scrolled to bottom
    }
  }, [hasQuiz, isScrolledToBottom]);

  const renderCourseName = () => {
    if (course) {
      return (
        <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToCourse}>
          <ChevronLeft className="text-appPrimary" size={22} />
          <p className="text-xl font-bold text-appPrimary">{course.courseName}</p>
        </div>
      );
    }
  };

  // const renderContent = () => {
  //   if (lesson && lesson.content != null) {
  //     return <MarkdownRender lesson={lesson} setIsScrolledToBottom={setIsScrolledToBottom} />;
  //   }
  // };

  // TESTING
  const renderContent = () => {
    if (lesson && lesson.content != null) {
      return <MarkdownRender lesson={lesson} setIsScrolledToBottom={setIsScrolledToBottom} />;
    }
  };

  // const renderQuiz = () => {
  //   if (!quiz) return null;
  //   return (
  //     <div className="space-y-4">
  //       <p className="text-4xl font-bold">Quiz</p>
  //       <LessonQuiz quiz={quiz} lessonId={id!} answerCallback={handleLessonDoneCallback} />
  //     </div>
  //   );
  // };

  const renderProblem = () => {
    let content = null;
    if (lesson?.problemId && isLessonDone) {
      content = (
        <div
          className="flex items-center gap-2 px-3 py-3 cursor-pointer border-y border-gray4 max-w-7xl"
          onClick={navigateToProblem}
        >
          <p>Solve this lesson's problem</p>
          <div className="ml-auto">
            <ChevronRight style={{ color: "gray" }} size={22} />
          </div>
        </div>
      );
    }
    return content;
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
    console.log("Next lesson", nextLesson);
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

  const renderQuizPage = () => {
    return (
      <div className="flex-col items-center justify-center">
        <div className="text-lg font-bold">This lesson has some quizzes. Finish them to complete this lesson.</div>
        <Button
          className="mt-4 bg-appPrimary"
          onClick={() =>
            navigate(`quiz/${lesson?.exerciseId}?learningId=${lesson?.learningId}&courseId=${lesson?.courseId}`)
          }
        >
          Go to quiz page
        </Button>
      </div>
    );
  };

  return (
    <div className="p-5 px-6 space-y-8 sm:px-20">
      {loading ? (
        renderSkeleton()
      ) : (
        <>
          {renderCourseName()}
          {renderContent()}
          {renderQuizPage()}
          {renderProblem()}
          {renderNextLesson()}
          {renderFinishLesson()}
        </>
      )}
    </div>
  );
};
