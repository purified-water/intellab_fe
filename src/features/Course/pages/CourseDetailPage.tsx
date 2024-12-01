import { useState, useEffect } from "react";
import { Header, LessonList } from "@/features/Course/components";
import { fakeLessons } from "@/constants/fakeData";
import { useParams } from "react-router-dom";

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Lessons");

  //NOTE: Quoc-29/11/2024: saving the enrolled courses in localStorage for now, calling API later
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    if (enrolledCourses.includes(id)) {
      setIsEnrolled(true);
    }
  }, [id]);

  const handleEnroll = () => {
    setIsEnrolled(true);
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    if (!enrolledCourses.includes(id)) {
      enrolledCourses.push(id);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    }
  };

  const renderHeader = () => {
    return (
      <Header
        title="Introduction to String"
        description="A fundamental course for String data type"
        isEnrolled={isEnrolled}
        rating={4.5}
        reviews={15700}
        onEnroll={handleEnroll}
      />
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lessons":
        return <LessonList lessons={fakeLessons} isEnrolled={isEnrolled} />;
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
    </div>
  );
};
