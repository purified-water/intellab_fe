import { useState, useEffect } from "react";
import { Header, LessonList, Reviews, CourseCommentSection } from "@/features/Course/components";
import { useParams } from "react-router-dom";
import { courseAPI, paymentAPI } from "@/lib/api";
import { IEnrolledLesson } from "../types";
import { ICourse, ILesson } from "@/types";
import { Spinner, Pagination, EmptyList } from "@/components/ui";
import { DEFAULT_COURSE } from "@/constants/defaultData";
import { getUserIdFromLocalStorage } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import RatingModal from "../components/RatingModal";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils/toastUtils";
import { API_RESPONSE_CODE } from "@/constants";
import { AppFooter } from "@/components/AppFooter";
import { useSearchParams } from "react-router-dom";
import { CommentContext } from "../../../hooks/useCommentContext";

const TAB_BUTTONS = {
  LESSONS: "Lessons",
  COMMENTS: "Comments",
  REVIEWS: "Reviews"
};

export const CourseDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const redirectedCommentId = searchParams.get("commentId");
  const [activeTab, setActiveTab] = useState("Lessons");
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lessons, setLessons] = useState<ILesson[] | IEnrolledLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  // Add a refresh trigger state to force re-renders when needed
  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch userId and isEnrolled from Redux and local storage
  const userId = getUserIdFromLocalStorage();
  const userRedux = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const courses = useSelector((state: RootState) => state.course.courses);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Constants for timing logic
  const PROMPT_DELAY_DAYS = 7; // Show again after 7 days if dismissed
  const MAX_DISMISSALS = 100; // Stop showing after 3 dismissals

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getCourseDetail = async () => {
    setLoading(true);
    const response = await courseAPI.getCourseDetail(id!);
    const { result } = response;

    // If the user already enrolled in the course, update the Redux store to get the correct lessons type
    if (result.userEnrolled) {
      // dispatch(updateUserEnrolled({ courseId: id!, isEnrolled: true }));
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }

    setCourse(result);
    // Set document title
    document.title = `${result.courseName} | Intellab`;
    setLoading(false);
  };

  const createCoursePaymentAPI = async () => {
    try {
      const response = await paymentAPI.createCoursePayment(course!.courseId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS && result) {
        window.location.href = result.paymentUrl!;
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error creating payment" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error creating payment" });
      }
    }
  };

  const getCourseLessons = async (page: number) => {
    setLoading(true);

    if (isEnrolled && isAuthenticated) {
      try {
        const response = await courseAPI.getLessonsAfterEnroll(id!, page);
        const lessons = response.result.content;
        console.log("lessons", lessons);
        setLessons(lessons);
        setLoading(false);
        setCurrentPage(response.result.number);
        setTotalPages(response.result.totalPages);
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToastError({ toast: toast.toast, message: error.message ?? "Error fetching lessons" });
          setLoading(false);
        }
      }
    } else {
      try {
        const response = await courseAPI.getLessons(id!, page);
        const lessons = response.result.content;
        lessons.sort((a: ILesson, b: ILesson) => a.lessonOrder - b.lessonOrder);
        setLessons(lessons);
        setCurrentPage(response.result.number);
        setTotalPages(response.result.totalPages);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToastError({ toast: toast.toast, message: error.message ?? "Error fetching lessons" });
          setLoading(false);
        }
      }
    }
  };

  // Function to check if we should show the review prompt
  const shouldShowReviewPrompt = (courseId: string, userUid: string) => {
    // Retrieve existing review prompt data from localStorage
    const storedData = JSON.parse(localStorage.getItem("reviewPrompt") || "{}");

    // Get the data specific to the current course and user
    const courseData = storedData[courseId]?.[userUid] || { lastPromptDate: null, dismissCount: 0, reviewed: false };

    // Destructure the necessary data
    const { lastPromptDate, dismissCount, reviewed } = courseData;

    // If the user has already reviewed, don't show the prompt
    if (reviewed) return false;

    // If the user has dismissed the prompt too many times, don't show it
    if (dismissCount >= MAX_DISMISSALS) return false;

    // Check if enough days have passed since the last prompt
    const now = new Date();
    const lastDate = lastPromptDate ? new Date(lastPromptDate) : null;

    // If the user has never been prompted before, show the prompt
    if (!lastDate) {
      return true;
    }

    // Calculate the difference in days between the current date and last prompt date
    const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24); // Difference in days
    return diffDays >= PROMPT_DELAY_DAYS; // Show the prompt if enough days have passed
  };

  useEffect(() => {
    getCourseDetail();
    getCourseLessons(0);

    if (redirectedCommentId) {
      setActiveTab(TAB_BUTTONS.COMMENTS);
    }

    if (course?.progressPercent == 100 && shouldShowReviewPrompt(course?.courseId, userId ?? "")) {
      openModal();
    }
  }, [isAuthenticated, courses, isEnrolled]); // Re-fetch when `userEnrolled` changes or `courses` changes

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      showToastError({ toast: toast.toast, title: "Login required", message: "Please login to enroll in the course" });
    }
    // NOTE: comment this else-if for testing
    else if (!userRedux?.isEmailVerified) {
      showToastError({
        toast: toast.toast,
        title: "Email verification required",
        message: (
          <>
            Please go to the{" "}
            <a href="/profile/edit" className="text-appHyperlink underline">
              Setting Page
            </a>{" "}
            and verify your email to enroll in the course.
          </>
        )
      });
    } else {
      enrollCourseHandler();
    }
  };

  const enrollCourseHandler = async () => {
    setLoading(true);
    try {
      const response = await courseAPI.enrollCourse(userId!, id!);
      if (response.code === 0) {
        // dispatch(updateUserEnrolled({ courseId: id!, isEnrolled: true }));
        setIsEnrolled(true);
        showToastSuccess({ toast: toast.toast, message: "Enrolled successfully" });
      } else {
        setIsEnrolled(false);
        showToastError({ toast: toast.toast, message: "Error enrolling course" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error enrolling course" });
      } else {
        showToastError({ toast: toast.toast, message: "Error enrolling course" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueClick = () => {
    if (lessons.length > 0 && course?.latestLessonId != null) {
      navigate(`/lesson/${course.latestLessonId}?courseId=${course.courseId}`);
    } else {
      const firstLesson = lessons[0];
      navigate(`/lesson/${firstLesson.lessonId}?courseId=${course!.courseId}`);
    }
  };

  const handleViewCertificateClick = () => {
    navigate(`/certificate/${course?.certificateId}`);
  };

  const handlePurchaseClick = async () => {
    if (!isAuthenticated) {
      showToastError({ toast: toast.toast, title: "Login required", message: "Please login to purchase the course" });
    } else if (!userRedux?.isEmailVerified) {
      showToastError({
        toast: toast.toast,
        title: "Email verification required",
        message: (
          <>
            Please go to the{" "}
            <a href="/profile/edit" className="text-appHyperlink underline">
              Setting Page
            </a>{" "}
            and verify your email to purchase the course.
          </>
        )
      });
    } else {
      await createCoursePaymentAPI();
    }
  };

  const handleCertificateReady = (updatedCourse: ICourse) => {
    // Update course with new certificate info
    setCourse(updatedCourse);
    // Re-fetch course lessons to refresh the UI
    getCourseLessons(currentPage);
    // Show a toast indicating the course data has been updated
    showToastSuccess({
      toast: toast.toast,
      message: "Certificate is ready! Course information has been updated."
    });
  };

  const renderHeader = () => {
    return (
      course && (
        <Header
          course={course!}
          onEnroll={handleEnrollClick}
          onContinue={handleContinueClick}
          onViewCertificate={handleViewCertificateClick}
          onPurchase={handlePurchaseClick}
          onCertificateReady={handleCertificateReady}
        />
      )
    );
  };

  const renderTabContent = () => {
    let content = null;
    switch (activeTab) {
      case TAB_BUTTONS.LESSONS:
        content = (
          <div>
            {lessons.length === 0 && !loading ? (
              <div className="text-center py-10">
                <EmptyList message="No lessons available for this course yet." />
              </div>
            ) : (
              <LessonList
                lessons={lessons}
                isEnrolled={course?.userEnrolled || DEFAULT_COURSE.userEnrolled}
                lastViewedLessonId={course?.latestLessonId}
                course={course!}
              />
            )}
            {totalPages != 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => getCourseLessons(page)}
              />
            )}
            {isModalOpen && (
              <RatingModal
                closeModal={closeModal}
                courseTitle={course?.courseName ?? ""}
                courseId={course?.courseId ?? ""}
                isReviewTab={false}
              />
            )}
          </div>
        );
        break;
      case TAB_BUTTONS.COMMENTS:
        content = course && <CourseCommentSection course={course} />;
        break;
      case TAB_BUTTONS.REVIEWS:
        content = (
          <Reviews
            courseTitle={course?.courseName ?? ""}
            courseId={course?.courseId ?? ""}
            hasCompleted={course?.progressPercent == 100}
          />
        );
        break;
      default:
        break;
    }

    return <div className="w-[90%]">{content}</div>;
  };

  const renderTabButton = (tab: string, key: number) => {
    return (
      <button
        key={key}
        onClick={() => setActiveTab(tab)}
        className={activeTab === tab ? "text-appAccent underline" : "text-gray3 hover:text-appAccent/80"}
      >
        {tab}
      </button>
    );
  };

  const renderBody = () => {
    return (
      <>
        <div className="flex justify-center gap-10 mb-4 text-xl font-bold">
          {Object.values(TAB_BUTTONS).map((tab, index) => renderTabButton(tab, index))}
        </div>
        <div className="px-6 justify-items-center">{renderTabContent()}</div>
      </>
    );
  };

  const renderSpinner = () => {
    return <Spinner loading={loading} overlay />;
  };

  return (
    <CommentContext.Provider value={{ commentId: redirectedCommentId ?? "" }}>
      <div className="flex flex-col min-h-screen">
        <div className="w-full">{renderHeader()}</div>
        <div className="pb-8 px-32 mx-auto w-full flex-grow">
          {renderBody()}
          {renderSpinner()}
        </div>
        <AppFooter />
      </div>
    </CommentContext.Provider>
  );
};
