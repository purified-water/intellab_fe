import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { courseAPI, userAPI } from "@/lib/api";
import { ILesson, ICourse } from "@/types";
import { clearBookmark, getUserIdFromLocalStorage } from "@/utils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
// import { MarkdownRender } from "../components/MarkdownRender";
import { Button } from "@/components/ui";
// import MarkdownEditor from "../components/MarkdownRender2";
import { RenderLessonMarkdown } from "../components/RenderLessonContent";
// import { testData } from "../components/testData";
import { TOCItem, TableOfContents } from "../components";
import { AppFooter } from "@/components/AppFooter";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { setUser } from "@/redux/user/userSlice";

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasQuiz, setHasQuiz] = useState<boolean>(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState<boolean>(false);
  const [isLessonDone, setIsLessonDone] = useState<boolean>(false);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const userId = getUserIdFromLocalStorage();
  const [searchParams] = useSearchParams();
  const learningId = searchParams.get("learningId");
  const courseId = searchParams.get("courseId");
  const [course, setCourse] = useState<ICourse | null>(null);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    getCourseDetail();
    getLessonDetail();
  }, [id]);

  useEffect(() => {
    updateTheoryDone();
  }, [hasQuiz, isScrolledToBottom]);

  // Setup intersection observer for headings
  useEffect(() => {
    if (!tocItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0
      }
    );

    // Observe all heading elements
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, [tocItems]);

  // Setup scroll detection to determine if user reached bottom
  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled to bottom (with a small buffer)
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (scrolledToBottom) {
        setIsScrolledToBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // since we can't cover all the case to check is course is finish and update the completedCourseCount in Redux
    // we will just call getProfileMeAPI to update the user profile
    // this is not the best solution but it works for now
    if (isAuthenticated && lesson && !lesson?.nextLessonId && isLessonDone) {
      getProfileMeAPI();
    }
  }, [isLessonDone]);

  const getProfileMeAPI = async () => {
    await userAPI.getProfileMe({
      onSuccess: async (user) => {
        dispatch(setUser(user));
      },
      onFail: async (message) => console.log("--> Error get profile", message)
    });
  };

  const getCourseDetail = async () => {
    if (courseId) {
      try {
        const response = await courseAPI.getCourseDetail(courseId);
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

      // console.log("Lesson detail", result);
      if (result.exerciseId) {
        setHasQuiz(true);
      }
      if (result.isDoneTheory) {
        setIsLessonDone(true);
      }
      setLesson(result);
      // Set document title
      document.title = `${result.lessonName} - ${course?.courseName} | Intellab`;
      setLoading(false);
    }
  };

  const updateTheoryDone = async () => {
    try {
      // if not quiz, mark as done when scrolled to bottom
      if (!hasQuiz && isScrolledToBottom && lesson) {
        await courseAPI.updateTheoryDone(lesson.learningId!, lesson.courseId!);
        // Remove bookmark after lesson is done
        clearBookmark(userId!, lesson.lessonId!);
        setIsLessonDone(true);
      }
    } catch (error) {
      console.log("Error updating theory done", error);
    }
  };

  const navigateToNextLesson = () => {
    if (lesson?.nextLessonId) {
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
    window.open(
      `/problems/${lesson!.problemId}?lessonId=${lesson!.lessonId}&lessonName=${lesson!.lessonName}&courseId=${lesson!.courseId}&courseName=${course!.courseName}&learningId=${lesson!.learningId}`,
      "_blank"
    );
  };

  const renderReturnToCourse = () => {
    if (course) {
      return (
        <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToCourse}>
          <ChevronLeft className="text-appPrimary" size={22} />
          <p className="text-xl font-bold text-appPrimary">{course.courseName}</p>
        </div>
      );
    }
    return null;
  };

  const renderProblem = () => {
    if (!lesson?.problemId) return null;

    return (
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
  };

  const renderNextLesson = () => {
    if (!lesson?.nextLessonId) return null;

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
      <div className="space-y-8">
        <Skeleton className="h-20 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="w-24 h-8 bg-gray5" />
      </div>
    );
  };

  const renderContinueToQuiz = () => {
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

  const renderContent = () => {
    if (lesson && lesson.content != null) {
      return (
        <div className="pr-4 space-y-6">
          <RenderLessonMarkdown lesson={lesson} setTocItems={setTocItems} />
          {renderContinueToQuiz()}
          {isLessonDone && lesson?.nextLessonId && <div className="text-2xl font-bold">What's next?</div>}
          {renderProblem()}
          {renderNextLesson()}
          {renderFinishLesson()}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 p-6 sm:pl-24 lg:grid-cols-5 md:pl-32 md:pr-8">
        {loading ? (
          <div className="col-span-1 lg:col-span-4">{renderSkeleton()}</div>
        ) : (
          <>
            <div className="col-span-1 lg:col-span-4">
              {renderReturnToCourse()}
              {renderContent()}
            </div>
            <div className="hidden col-span-1 lg:block">
              <div className="sticky top-5 lg:right-4">
                <TableOfContents items={tocItems} activeId={activeHeading} />
              </div>
            </div>
          </>
        )}
      </div>
      <AppFooter />
    </>
  );
};
