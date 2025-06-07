import { useState } from "react";
import { LessonList } from "./Lessons/LessonList";
import { CreateCourseSchema } from "../../../schemas";
interface PreviewCourseBodyProps {
  course: CreateCourseSchema;
}

export const PreviewCourseBody = ({ course }: PreviewCourseBodyProps) => {
  const TAB_BUTTONS = {
    LESSONS: "Lessons",
    COMMENTS: "Comments",
    REVIEWS: "Reviews"
  };
  const [activeTab, setActiveTab] = useState(TAB_BUTTONS.LESSONS);

  const renderTabButton = (tab: string, key: number) => {
    return (
      <button
        type="button"
        key={key}
        onClick={() => setActiveTab(tab)}
        className={activeTab === tab ? "text-appAccent underline" : "text-gray3 hover:text-appAccent/80"}
      >
        {tab}
      </button>
    );
  };

  const renderTabContent = () => {
    let content = null;
    switch (activeTab) {
      case TAB_BUTTONS.LESSONS:
        content = (
          <div>
            <LessonList lessons={course.courseLessons} />
          </div>
        );
        break;
      default:
        break;
    }

    return <div className="w-[90%]">{content}</div>;
  };

  return (
    <div className="w-full">
      <div className="flex gap-10 justify-center my-4 text-xl font-bold">
        {Object.values(TAB_BUTTONS).map((tab, index) => renderTabButton(tab, index))}
      </div>
      <div className="px-6 justify-items-center">{renderTabContent()}</div>
    </div>
  );
};
