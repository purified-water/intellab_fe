import { useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { amountTransformer } from "@/utils";
import { ICourse } from "../types";
import CourseSummaryDialog from "@/components/ui/CourseSummaryDialog";
import { aiAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

interface HeaderProps {
  course: ICourse;
  onEnroll: () => void;
  onContinue: () => void;
  onViewCertificate: () => void;
}

export const Header = (props: HeaderProps) => {
  const { course, onEnroll, onContinue, onViewCertificate } = props;
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const isFinished = course.progressPercent == 100;

  const renderReview = () => {
    return (
      <div className="mt-2 text-xs">
        <span className="px-2 py-1 text-white bg-black rounded-full">⭐ {course.averageRating}</span>
        <span> • {amountTransformer(course.reviewCount)} reviews</span>
      </div>
    );
  };

  const renderLeftButton = () => {
    let buttonText;
    let onClick;

    if (course.userEnrolled) {
      if (isFinished) {
        buttonText = "View Certificate";
        onClick = onViewCertificate;
      } else {
        buttonText = "Continue";
        onClick = onContinue;
      }
    } else {
      buttonText = "Enroll";
      onClick = onEnroll;
    }

    return (
      <button
        className="min-w-[200px] py-2 text-xl font-bold text-black bg-white rounded-xl hover:bg-gray-300 "
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  };

  const handleSummaryClick = async () => {
    setLoading(true);
    try {
      // remove the special characters and the space at start and end from the course name
      const courseName = course.courseName.replace(/[^a-zA-Z0-9]/g, " ").trim();
      const response = await aiAPI.getSummaryContent(courseName, course.courseId, "false");
      const { content } = response;
      setSummaryContent(content);
      setShowSummaryDialog(true);
    } catch (error: any) {
      toast.toast({
        variant: "destructive",
        title: "An error occurred",
        description: `Failed to generate AI summary: ${error.message}`
      });
    }
    setLoading(false);
  };

  const renderRightButton = () => {
    return (
      <div
        className="min-w-[200px] flex rounded-xl bg-gradient-to-r from-[#E1D0FA] to-appAccent p-0.5 hover:bg-gray-300"
        onClick={handleSummaryClick}
      >
        <button className="flex-1 text-xl font-bold  text-black bg-white py-1 rounded-xl hover:bg-gray-300">
          AI Summary
        </button>
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <div className="flex mt-6  gap-8">
        {renderLeftButton()}
        {isFinished && renderRightButton()}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 mx-24 my-6 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary px-7 min-w-[500px]">
      <h1 className="text-4xl font-bold">{course.courseName}</h1>
      <p className="mt-2 text-justify">{course.description}</p>
      {course.userEnrolled ? <ProgressBar progress={course.progressPercent} /> : renderReview()}
      {renderButtons()}
      <CourseSummaryDialog
        isOpen={showSummaryDialog}
        summaryContent={summaryContent}
        onClose={() => setShowSummaryDialog(false)}
      />
      {loading && <Spinner overlay loading={loading} />}
    </div>
  );
};
