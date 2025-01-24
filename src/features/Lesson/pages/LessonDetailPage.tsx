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
import { MarkdownRender } from "../components/MarkdownRender";
// import { MarkdownRender } from "../components/MarkdownRender";

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
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
      // setNextLessonOrder(result.lessonOrder! + 1);
      setLesson(result);

      if (lesson?.exerciseId) {
        setHasQuiz(true);
      }

      setLoading(false);
    }
  };

  const updateTheoryDone = async () => {
    // setIsCorrect(isCorrect);
    try {
      console.log("Has quiz", hasQuiz);
      // if not quiz, mark as done when scrolled to bottom
      if (!hasQuiz && isScrolledToBottom) {
        await courseAPI.updateTheoryDone(lesson!.learningId!, lesson!.courseId!, userId!);
        console.log("Mark as done");
        // Remove bookmark after lesson is done
        clearBookmark(userId!, lesson!.lessonId!);

        await courseAPI.updatePracticeDone(lesson!.learningId!, lesson!.courseId, userId!); // TEMPORARY MARK AS DONE for practice because no practice yet
        setIsLessonDone(true);
      }
    } catch (error) {
      console.log("Error updating theory done", error);
    }
  };

  // const fetchNextLesson = async () => {
  //   try {
  //     if (lesson?.nextLessonId == null || lesson?.courseId == null) {
  //       return;
  //     }

  //     const response = await courseAPI.getLessons(lesson!.courseId!, 100);
  //     const { result } = response;
  //     const content = result.content;

  //     const nextLesson = content.find((les: ILesson) => les.lessonId === lesson?.nextLessonId);
  //     setNextLesson(nextLesson!);
  //   } catch (error) {
  //     console.log("Error fetching next lesson", error);
  //   }
  // };

  const navigateToNextLesson = () => {
    if (lesson?.nextLessonId) {
      console.log("Has next lesson");
      // setIsCorrect(null);
      setIsLessonDone(false);
      setIsScrolledToBottom(false);
      setLesson(null);
      window.scrollTo(0, 0);
      navigate(`/lesson/${lesson.nextLessonId}`);
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

  // useEffect(() => {
  //   if (lesson) {
  //     // getLessonQuiz();
  //     // fetchNextLesson();
  //   }
  // }, [lesson]);

  useEffect(() => {
    getCourseDetail();
    getLessonDetail();
  }, [id]);

  useEffect(() => {
    updateTheoryDone();
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

  const renderProblem = () => {
    let content = null;
    if (lesson?.problemId && isLessonDone) {
      content = (
        <div
          className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
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
    if (!lesson?.nextLessonId || !isLessonDone) return null;

    return (
      <div
        className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
        onClick={navigateToNextLesson}
      >
        <p>Continue to next Lesson:</p>
        <p className="font-bold">{lesson.nextLessonName}</p>
        <div className="ml-auto">
          <ChevronRight style={{ color: "gray" }} size={22} />
        </div>
      </div>
    );
  };

  const renderFinishLesson = () => {
    if (lesson?.nextLessonId) return null;

    return (
      <div
        className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
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
    if (!lesson?.exerciseId) return null;

    return (
      <div className="flex-col items-center justify-center">
        <div className="mb-6 text-2xl font-bold">Pass the quiz to complete this theory lesson</div>
        <div
          className="flex items-center max-w-5xl gap-2 px-3 py-3 cursor-pointer border-y border-gray4"
          onClick={() =>
            navigate(`quiz/${lesson?.exerciseId}?learningId=${lesson?.learningId}&courseId=${lesson?.courseId}`)
          }
        >
          <p>Continue to the quiz page</p>
          <div className="ml-auto">
            <ChevronRight style={{ color: "gray" }} size={22} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 px-6 pb-24 space-y-6 sm:px-20">
      {loading ? (
        renderSkeleton()
      ) : (
        <>
          {renderCourseName()}
          {renderContent()}
          {renderQuizPage()}
          <div className="text-2xl font-bold">What's next?</div>
          {renderProblem()}
          {renderNextLesson()}
          {renderFinishLesson()}
        </>
      )}
    </div>
  );
};
