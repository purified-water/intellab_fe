import { LessonList } from "@/features/Course/components";
import { useState } from "react";
import { DEFAULT_CREATE_COURSE_LESSONS } from "../../../constants";
import { ICreateCourse } from "../../../types";

interface PreviewCourseBodyProps {
  course: ICreateCourse;
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
            <LessonList lessons={DEFAULT_CREATE_COURSE_LESSONS} isEnrolled={true} course={course} />
          </div>
        );
        break;
      default:
        break;
    }

    return <div className="w-[90%]">{content}</div>;
  };

  return (
    <>
      <div className="flex gap-10 pl-10 my-4 text-xl font-bold ml-14">
        {Object.values(TAB_BUTTONS).map((tab, index) => renderTabButton(tab, index))}
      </div>
      <div className="px-6 justify-items-center">{renderTabContent()}</div>
    </>
  );
};
