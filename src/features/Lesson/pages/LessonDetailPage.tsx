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
import { Button } from "@/components/ui";
// import MarkdownEditor from "../components/MarkdownRender2";
// import { testData } from "../components/testData";

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
          await courseAPI.updateLessonLearningProgress(learningId, courseId);
        } catch (error) {
          console.log("Error updating learning progress", error);
        }
      }
      const response = await courseAPI.getLessonDetail(id);
      const { result } = response;

      console.log("Lesson detail", result);
      if (result.exerciseId) {
        setHasQuiz(true);
      }
      if (result.isDoneTheory) {
        setIsLessonDone(true);
      }
      setLesson(result);
      setLoading(false);
    }
  };

  const updateTheoryDone = async () => {
    try {
      // if not quiz, mark as done when scrolled to bottom
      if (!hasQuiz && isScrolledToBottom) {
        await courseAPI.updateTheoryDone(lesson!.learningId!, lesson!.courseId!);
        console.log("Mark as done");
        // Remove bookmark after lesson is done
        clearBookmark(userId!, lesson!.lessonId!);
        setIsLessonDone(true);
      }
    } catch (error) {
      console.log("Error updating theory done", error);
    }
  };

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
      `/problems/${lesson!.problemId}?lessonId=${lesson!.lessonId}&lessonName=${lesson!.lessonName}&courseId=${course!.courseId}&courseName=${course!.courseName}&learningId=${lesson!.learningId}`
    );
  };

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
      // return <MarkdownEditor markdown={testData} />;
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
      <div className="flex-col items-center justify-center">
        <div className="mb-2 text-2xl font-bold">Congratulation! You have finished the course</div>
        <div className="mb-6 text-xl font-semi">Return to course page to view you certificate</div>
        <Button
          className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
          onClick={navigateToCourse}
        >
          Return to course
        </Button>
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
        <Button
          className="h-10 px-6 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/80 disabled:bg-gray5 disabled:text-gray3"
          onClick={() =>
            navigate(
              `quiz/${lesson?.exerciseId}?learningId=${lesson?.learningId}&courseId=${lesson?.courseId}&isDone=${lesson?.isDoneTheory}`
            )
          }
        >
          {lesson.isDoneTheory ? <p>View your quiz result</p> : <p>Continue to quiz page</p>}
        </Button>
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
          {isLessonDone && lesson?.nextLessonId && <div className="text-2xl font-bold">What's next?</div>}
          {renderProblem()}
          {renderNextLesson()}
          {renderFinishLesson()}
        </>
      )}
    </div>
  );
};
