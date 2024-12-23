import { useState, useEffect } from "react";
import { Header, LessonList } from "@/features/Course/components";
import { useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ICourse, ILesson } from "../types";
import Spinner from "@/components/ui/Spinner";
import { DEFAULT_COURSE } from "@/constants/defaultData";

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Lessons");
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [loading, setLoading] = useState(false);

  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    return userId;
  };

  const getCourseDetail = async () => {
    setLoading(true);
    const response = await courseAPI.getCourseDetail(id!);
    const { result } = response;
    const { userEnrolled } = result;

    setCourse(result);
    setIsEnrolled(userEnrolled);
    setLoading(false);
  };

  const getCourseLessons = async () => {
    setLoading(true);
    const response = await courseAPI.getLessons(id!);
    const { result } = response;
    // Used to sort because the order of lessons in DB is not ascending
    result.sort((a: ILesson, b: ILesson) => a.lessonOrder - b.lessonOrder);

    setLessons(result);
    setLoading(false);
  };

  useEffect(() => {
    getCourseDetail();
    getCourseLessons();
  }, []);

  const enrollCourse = async () => {
    setLoading(true);
    const userId = getUserIdFromLocalStorage();
    const response = await courseAPI.enrollCourse(userId!, id!);
    //const { courseIds } = response.result;
    //if (courseIds.includes(id!)) {
    if (response.code === 0) {
      alert("Enroll successfully");
      setIsEnrolled(true);
    } else {
      alert("Enroll failed");
    }
    setLoading(false);
  };

  const handleEnrollClick = () => {
    const userId = getUserIdFromLocalStorage();
    if (userId == null || userId === "") {
      alert("Please login to enroll this course");
    } else {
      enrollCourse();
    }
  };

  const handleContinueClick = () => {
    // TODO: handle continue click
    console.log("--> Continue clicked");
  };

  const handleViewCertificateClick = () => {
    // TODO: handle view certificate click
    console.log("--> View certificate clicked");
  };

  const renderHeader = () => {
    return (
      <Header
        title={course?.courseName ?? DEFAULT_COURSE.courseName}
        description={course?.description ?? DEFAULT_COURSE.description}
        isEnrolled={isEnrolled ?? DEFAULT_COURSE.userEnrolled}
        rating={course?.rating ?? DEFAULT_COURSE.rating}
        reviews={course?.reviews ?? DEFAULT_COURSE.reviews}
        progress={course?.progress ?? DEFAULT_COURSE.progress}
        onEnroll={handleEnrollClick}
        onContinue={handleContinueClick}
        onViewCertificate={handleViewCertificateClick}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lessons":
        return <LessonList lessons={lessons} isEnrolled={isEnrolled ?? DEFAULT_COURSE.userEnrolled} />;
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
    <div className="mx-auto w-7/10">
      {renderHeader()}
      {renderBody()}
      <Spinner loading={loading} overlay />
    </div>
  );
};
