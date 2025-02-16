import { useState, useEffect } from "react";
import { Header, LessonList } from "@/features/Course/components";
import { useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ICourse, ILesson, IEnrolledLesson } from "../types";
import Spinner from "@/components/ui/Spinner";
import { DEFAULT_COURSE } from "@/constants/defaultData";
import { getUserIdFromLocalStorage } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import Pagination from "@/components/ui/Pagination";
import Reviews from "../components/Reviews";
import RatingModal from "../components/RatingModal";

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Lessons");
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lessons, setLessons] = useState<ILesson[] | IEnrolledLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

  // Fetch userId and isEnrolled from Redux and local storage
  const userId = getUserIdFromLocalStorage();
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
    const response = await courseAPI.getCourseDetail(id!, userId!);
    const { result } = response;

    // If the user already enrolled in the course, update the Redux store to get the correct lessons type
    if (result.userEnrolled) {
      // dispatch(updateUserEnrolled({ courseId: id!, isEnrolled: true }));
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }

    setCourse(result);
    setLoading(false);
  };

  const getCourseLessons = async (page: number) => {
    setLoading(true);

    if (isEnrolled && isAuthenticated) {
      try {
        const response = await courseAPI.getLessonsAfterEnroll(id!, page);
        const lessons = response.result.content;
        // console.log("Lessons after enroll", lessons);
        setLessons(lessons);
        setLoading(false);
        setCurrentPage(response.result.number);
        setTotalPages(response.result.totalPages);
      } catch (error) {
        console.log("Error fetching lessons", error);
        setLoading(false);
      }
    } else {
      try {
        const response = await courseAPI.getLessons(id!, page);
        const lessons = response.result.content;
        lessons.sort((a: ILesson, b: ILesson) => a.lessonOrder - b.lessonOrder);
        // console.log("Lessons before enroll", lessons);
        setLessons(lessons);
        setCurrentPage(response.result.number);
        setTotalPages(response.result.totalPages);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching lessons", error);
        setLoading(false);
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
    if (course?.progressPercent == 100 && shouldShowReviewPrompt(course?.courseId, userId ?? "")) {
      openModal();
    }
  }, [isAuthenticated, courses, isEnrolled]); // Re-fetch when `userEnrolled` changes or `courses` changes

  const handleEnrollClick = () => {
    if (isAuthenticated) {
      enrollCourseHandler();
    } else {
      alert("Please login to enroll in this course");
    }
  };

  const enrollCourseHandler = async () => {
    setLoading(true);
    try {
      const response = await courseAPI.enrollCourse(userId!, id!);
      if (response.code === 0) {
        // dispatch(updateUserEnrolled({ courseId: id!, isEnrolled: true }));
        setIsEnrolled(true);
        alert("Enroll successfully");
      } else {
        setIsEnrolled(false);
        alert("Enroll failed");
      }
    } catch (error) {
      console.log("Error enrolling course", error);
    }
    setLoading(false);
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

  const renderHeader = () => {
    return (
      course && (
        <Header
          course={course!}
          onEnroll={handleEnrollClick}
          onContinue={handleContinueClick}
          onViewCertificate={handleViewCertificateClick}
        />
      )
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lessons":
        return (
          <div>
            <LessonList
              lessons={lessons}
              isEnrolled={course?.userEnrolled || DEFAULT_COURSE.userEnrolled}
              lastViewedLessonId={course?.latestLessonId}
              course={course!}
            />
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
      case "Comments":
        return <div>Comments content goes here</div>;
      case "Reviews":
        // return <div>Reviews content goes here</div>;
        return (
          <Reviews
            courseTitle={course?.courseName ?? ""}
            courseId={course?.courseId ?? ""}
            hasCompleted={course?.progressPercent == 100}
          ></Reviews>
        );
      default:
        return null;
    }
  };

  const renderTabButton = (tab: string) => {
    return (
      <button
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
        <div className="flex gap-10 pl-10 mb-4 text-xl font-bold ml-14">
          {renderTabButton("Lessons")}
          {renderTabButton("Comments")}
          {renderTabButton("Reviews")}
        </div>
        <div className="px-6">{renderTabContent()}</div>
      </>
    );
  };

  return (
    <div className="pb-8 mx-auto max-w-7xl">
      {renderHeader()}
      {renderBody()}
      <Spinner loading={loading} overlay />
    </div>
  );
};
