import React, { useState } from "react";
import { Header, LessonList } from "@/features/Course/components";
import { fakeLessons } from "@/constants/fakeData";
import { useParams } from "react-router-dom";

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Lessons");

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

  return (
    <div className="mx-auto w-7/10">
      <Header
        title="Introduction to String"
        description="A fundamental course for String data type"
        isEnrolled={isEnrolled}
        rating={4.5}
        reviews={15700}
        onEnroll={() => setIsEnrolled(true)}
      />
      <div className="flex gap-10 text-xl font-bold ml-14 pl-10 mb-4">
        <button
          onClick={() => setActiveTab("Lessons")}
          className={activeTab === "Lessons" ? "text-pink-500 underline" : "text-gray-500"}
        >
          Lessons
        </button>
        <button
          onClick={() => setActiveTab("Comments")}
          className={activeTab === "Comments" ? "text-pink-500 underline" : "text-gray-500"}
        >
          Comments
        </button>
        <button
          onClick={() => setActiveTab("Reviews")}
          className={activeTab === "Reviews" ? "text-pink-500 underline" : "text-gray-500"}
        >
          Reviews
        </button>
      </div>
      <div className="px-6">{renderTabContent()}</div>
    </div>
  );
};
