import { useState, useEffect } from "react";
import { Header, LessonList } from "@/features/Course/components";
import { useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ICourse, ILesson } from "../types";
import Spinner from "@/components/ui/Spinner";

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Lessons");
  const [userId, setUserId] = useState("");
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [loading, setLoading] = useState(false);

  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId);
    }
  };

  const getCourseDetail = async () => {
    setLoading(true);
    const response = await courseAPI.getCourseDetail(id!);
    const { code, result } = response;
    const { userEnrolled } = result;
    setCourse(result);
    setIsEnrolled(userEnrolled);
    setLoading(false);
  };

  const getCourseLessons = async () => {
    setLoading(true);
    const response = await courseAPI.getLessons(id!);
    const { code, result } = response;
    setLessons(result);
    setLoading(false);
  };

  useEffect(() => {
    getCourseDetail();
    getUserIdFromLocalStorage();
    getCourseLessons();
  }, []);

  const enrollCourse = async () => {
    setLoading(true);
    const response = await courseAPI.enrollCourse(userId, id!);
    const { courseIds } = response.result;
    if (courseIds.includes(id!)) {
      alert("Enroll successfully");
      setIsEnrolled(true);
    } else {
      alert("Enroll failed");
    }
    setLoading(false);
  };

  const handleEnrollClick = () => {
    if (userId == null || userId === "") {
      alert("Please login to enroll this course");
    } else {
      enrollCourse();
    }
  };

  const renderHeader = () => {
    return (
      <Header
        title={course?.name!}
        description={course?.description!}
        isEnrolled={isEnrolled}
        rating={4.5}
        reviews={15700}
        onEnroll={handleEnrollClick}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lessons":
        return <LessonList lessons={lessons} isEnrolled={isEnrolled} />;
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
        <div className="flex gap-10 text-xl font-bold ml-14 pl-10 mb-4">
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
