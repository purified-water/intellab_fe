import { AnimatedButton } from "@/components/ui";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { useState } from "react";
import { ICourse } from "@/types";

interface PreviewCourseHeaderProps {
  course: ICourse;
}

export const PreviewCourseHeader = ({ course }: PreviewCourseHeaderProps) => {
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  const renderButtons = () => {
    return (
      <div className="flex gap-8 mt-6">
        <button className="px-6 py-1 font-bold text-black bg-white rounded-lg hover:bg-gray-300 ">
          View Certificate
        </button>

        <AnimatedButton label="AI Summary" onClick={() => setShowSummaryDialog(true)} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary px-7 min-w-[500px]">
      <h1 className="text-4xl font-bold">{course.courseName}</h1>
      <p className="mt-2 text-justify">{course.description}</p>
      {renderButtons()}
      <CourseSummaryDialog
        courseName={course.courseName}
        isOpen={showSummaryDialog}
        summaryContent={"Description"}
        onClose={() => {
          setShowSummaryDialog(false);
        }}
      />
    </div>
  );
};
