import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { courseAPI, userAPI } from "@/lib/api";
import { ILesson, ICourse } from "@/types";
import { getUserIdFromLocalStorage, showToastError } from "@/utils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { RenderLessonMarkdown } from "../components/RenderLessonContent";
import { LessonNavigation, TOCItem, TableOfContents } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { setPoint } from "@/redux/user/userSlice";
import { useAIExplainer } from "../hooks/useAIExplainer";
import { useLessonProgress, useTableOfContents } from "../hooks";
import { useToast } from "@/hooks";
import React from "react";
import { Spinner } from "@/components/ui";

// Dynamic imports for conditionally rendered components
const AIExplainerMenu = React.lazy(() =>
  import("../components").then((module) => ({ default: module.AIExplainerMenu }))
);
const AIExplainerTutorialModal = lazy(() =>
  import("../components").then((module) => ({
    default: module.AIExplainerTutorialModal
  }))
);
const LessonAiOrb = lazy(() =>
  import("../components").then((module) => ({
    default: module.LessonAiOrb
  }))
);
const AppFooter = lazy(() =>
  import("@/components/AppFooter").then((module) => ({
    default: module.AppFooter
  }))
);

export const LessonDetailPage = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const { id } = useParams();
  const userId = getUserIdFromLocalStorage();
  const [searchParams] = useSearchParams();
  const learningId = searchParams.get("learningId");
  const courseId = searchParams.get("courseId");

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const toast = useToast();

  // AI Explainer state
  const [isExplainerToggled, setIsExplainerToggled] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(localStorage.getItem("hasViewedExplainerTutorial") !== "true");
  const [isOpenChatbox, setIsOpenChatbox] = useState(false);

  // Custom hooks
  const { isLessonDone, resetProgress } = useLessonProgress({ lesson, userId });
  const { activeHeading } = useTableOfContents({ tocItems });
  const {
    menuRef,
    menuPosition,
    isAIExplainerOpen,
    setIsAIExplainerOpen,
    selectedText,
    setSelectedText,
    resetExplainer
  } = useAIExplainer({ isExplainerToggled });

  // Lesson navigation functions
  const LessonNav = LessonNavigation({
    lesson,
    course,
    navigateToNextLesson: () => {
      if (lesson?.nextLessonId) {
        resetProgress();
        setLesson(null);
        window.scrollTo(0, 0);
        navigate(`/lesson/${lesson.nextLessonId}`);
      }
    },
    navigateToCourse: () => navigate(`/course/${lesson?.courseId}`),
    navigateToProblem: () => {
      window.open(
        `/problems/${lesson?.problemId}?lessonId=${lesson?.lessonId}&lessonName=${lesson?.lessonName}&courseId=${lesson?.courseId}&courseName=${course?.courseName}&learningId=${lesson?.learningId}`,
        "_blank"
      );
    }
  });

  // Initial data loading
  useEffect(() => {
    getCourseDetail();
    getLessonDetail();
  }, [id]);

  const getMyPointAPI = async () => {
    await userAPI.getMyPoint({
      onSuccess: async (point) => {
        dispatch(setPoint(point));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  // Get user point after finishing a course (no next lesson)
  useEffect(() => {
    if (isAuthenticated && lesson && !lesson?.nextLessonId && isLessonDone) {
      getMyPointAPI();
    }
  }, [isLessonDone]);

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

      try {
        const response = await courseAPI.getLessonDetail(id);
        const { result } = response;

        setLesson(result);
        // Set document title
        document.title = `${result.lessonName} - ${course?.courseName || "Course"} | Intellab`;
        setLoading(false);
      } catch (error) {
        console.log("Error fetching lesson detail", error);
        setLoading(false);
      }
    }
  };

  const renderSkeleton = () => {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="h-6 bg-gray5" />
        <Skeleton className="w-24 h-8 bg-gray5" />
      </div>
    );
  };

  const renderContent = () => {
    if (lesson && lesson.content != null) {
      return (
        <div className="pr-8 space-y-6" id="lesson-detail-content">
          <RenderLessonMarkdown lesson={lesson} setTocItems={setTocItems} />
          {LessonNav?.renderContinueToQuiz()}
          {lesson?.nextLessonId && <div className="text-2xl font-bold">What's next?</div>}
          {LessonNav?.renderProblem()}
          {LessonNav?.renderNextLesson()}
          {LessonNav?.renderFinishLesson()}
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-2 p-6 sm:pl-24 lg:grid-cols-5 md:pl-40 md:pr-24">
        {loading ? (
          <div className="col-span-1 lg:col-span-4">{renderSkeleton()}</div>
        ) : (
          <>
            <div className="col-span-1 lg:col-span-4">
              {LessonNav?.renderReturnToCourse()}
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

      {menuPosition && (
        <>
          {isAIExplainerOpen && <div className="fixed inset-0 bg-transparent"></div>}
          <div
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.align === "left" ? menuPosition.x : undefined,
              right: menuPosition.align === "right" ? window.innerWidth - menuPosition.x : undefined
            }}
          >
            <Suspense fallback={<Spinner className="size-6" loading />}>
              <AIExplainerMenu
                key={`explainer-${selectedText?.substring(0, 20)}`} // Add a more reliable key
                ref={menuRef}
                isOpen={isAIExplainerOpen}
                setIsOpen={setIsAIExplainerOpen}
                input={selectedText}
                setInput={setSelectedText}
                lesson={lesson}
                setOpenChatbox={setIsOpenChatbox}
                resetExplainer={resetExplainer} // Pass the reset function
              />
            </Suspense>
          </div>
        </>
      )}
      {isTutorialOpen && (
        <Suspense fallback={<Spinner className="size-6" loading />}>
          <AIExplainerTutorialModal
            onClose={() => {
              localStorage.setItem("hasViewedExplainerTutorial", "true");
              setIsTutorialOpen(false);
            }}
          />
        </Suspense>
      )}
      <Suspense fallback={<Spinner className="size-6" loading />}>
        <LessonAiOrb
          isExplainerEnabled={isExplainerToggled}
          setIsExplainerToggled={setIsExplainerToggled}
          lesson={lesson}
          askFollowUp={isOpenChatbox}
        />
      </Suspense>
      <Suspense fallback={<Spinner className="size-6" loading />}>
        <AppFooter />
      </Suspense>
    </>
  );
};
