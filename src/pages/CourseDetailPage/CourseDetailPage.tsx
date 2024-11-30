import React, { useState } from "react";
import { Header, LessonList } from "./components";
import { Lesson } from "@/types";

const lessons: Lesson[] = [
  {
    id: 1,
    title: "What is String",
    description: "String definitions",
    isCompletedTheory: true,
    isCompletedPractice: false
  },
  {
    id: 2,
    title: "Characters",
    description: "Some examples with string",
    isCompletedTheory: true,
    isCompletedPractice: true
  },
  {
    id: 3,
    title: "Working with string",
    description: "Some examples with string",
    isCompletedTheory: true,
    isCompletedPractice: false
  },
  {
    id: 4,
    title: "Updating string",
    description: "More complex insights",
    isCompletedTheory: false,
    isCompletedPractice: false
  },
  {
    id: 5,
    title: "Traversing",
    description: "Common progress-blocking problems",
    isCompletedTheory: false,
    isCompletedPractice: false
  },
  {
    id: 6,
    title: "Ending",
    description: "Make it all make sense together",
    isCompletedTheory: false,
    isCompletedPractice: false
  }
];

export const CourseDetailPage: React.FC = () => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Lessons");

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

  return (
    <div className="gap-5 p-5 mx-auto w-7/10">
      <Header
        title="Introduction to String"
        description="A fundamental course for String data type"
        isEnrolled={isEnrolled}
        onEnroll={() => setIsEnrolled(true)}
      />
      <div className="flex gap-5 p-2.5 text-2xl font-bold">
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
