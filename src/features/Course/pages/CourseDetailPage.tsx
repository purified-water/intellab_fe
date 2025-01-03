import { useState, useEffect } from "react";
import { Header, LessonList } from "@/features/Course/components";
import { useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ICourse, ILesson, IEnrolledLesson } from "../types";
import Spinner from "@/components/ui/Spinner";
import { DEFAULT_COURSE } from "@/constants/defaultData";
import { getUserIdFromLocalStorage } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AppDispatch } from "@/redux/store";
import { updateUserEnrolled } from "@/redux/course/courseSlice";

export const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Lessons");
  const [course, setCourse] = useState<ICourse | null>(null);
  const [lessons, setLessons] = useState<ILesson[] | IEnrolledLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch userId and isEnrolled from Redux and local storage
  const userId = getUserIdFromLocalStorage();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const courses = useSelector((state: RootState) => state.course.courses);

  const getCourseDetail = async () => {
    setLoading(true);
    const response = await courseAPI.getCourseDetail(id!, userId!);
    const { result } = response;

    // If the user already enrolled in the course, update the Redux store to get the correct lessons type
    if (result.userEnrolled) {
      dispatch(updateUserEnrolled({ courseId: id!, isEnrolled: true }));
    }

    setCourse(result);
    setLoading(false);
  };

  const getCourseLessons = async () => {
    setLoading(true);

    const courseData = courses ? courses.find((course) => course.courseId === id) : null; // Find the course from Redux store
    const userEnrolled = courseData ? courseData.userEnrolled : false;

    if (userEnrolled && isAuthenticated) {
      try {
        const response = await courseAPI.getLessonsAfterEnroll(id!, userId!);
        const lessons = response.result.content;
        // console.log("Lessons after enroll", lessons);
        setLessons(lessons);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching lessons", error);
        setLoading(false);
      }
    } else {
      try {
        const response = await courseAPI.getLessons(id!);
        const lessons = response.result.content;
        lessons.sort((a: ILesson, b: ILesson) => a.lessonOrder - b.lessonOrder);
        // console.log("Lessons before enroll", lessons);
        setLessons(lessons);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching lessons", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getCourseDetail();
    getCourseLessons();
  }, [isAuthenticated, courses]); // Re-fetch when `userEnrolled` changes or `courses` changes

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
        dispatch(updateUserEnrolled({ courseId: id!, isEnrolled: true }));
        alert("Enroll successfully");
      } else {
        alert("Enroll failed");
      }
    } catch (error) {
      console.log("Error enrolling course", error);
    }
    setLoading(false);
  };

  const handleContinueClick = () => {
    if (lessons.length > 0 && course?.latestLessonId != null) {
      navigate(`/lesson/${course.latestLessonId}`);
    } else {
      const firstLesson = lessons[0];
      navigate(`/lesson/${firstLesson.lessonId}`);
    }
  };

  const handleViewCertificateClick = () => {
    // TODO: Implement certificate page
    alert("Upcoming feature");
  };

  const renderHeader = () => {
    return (
      <Header
        title={course?.courseName ?? DEFAULT_COURSE.courseName}
        description={course?.description ?? DEFAULT_COURSE.description}
        isEnrolled={course?.userEnrolled ?? DEFAULT_COURSE.userEnrolled}
        rating={course?.averageRating ?? DEFAULT_COURSE.averageRating}
        reviews={course?.reviewCount ?? DEFAULT_COURSE.reviewCount}
        progress={course?.progressPercent ?? DEFAULT_COURSE.progressPercent}
        onEnroll={handleEnrollClick}
        onContinue={handleContinueClick}
        onViewCertificate={handleViewCertificateClick}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lessons":
        return (
          <LessonList
            lessons={lessons}
            isEnrolled={course?.userEnrolled || DEFAULT_COURSE.userEnrolled}
            lastViewedLessonId={course?.latestLessonId}
          />
        );
      case "Comments":
        return <div>Comments content goes here</div>;
      case "Reviews":
        return <div>Reviews content goes here</div>;
      default:
        return null;
    }
  };

  const renderTabButton = (tab: string) => {
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={activeTab === tab ? "text-appAccent underline" : "text-gray3"}
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
    <div className="pb-8 mx-auto w-7/10">
      {renderHeader()}
      {renderBody()}
      <Spinner loading={loading} overlay />
    </div>
  );
};
