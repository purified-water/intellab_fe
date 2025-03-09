import { useEffect, useState } from "react";
import { ProblemDescription } from "./ProblemDescription";
import { ProblemType } from "@/types/ProblemType";
import { TestCaseType } from "../../types/TestCaseType";
import { SubmissionInformation } from "./SubmissionInformation";
import { SubmissionHistory } from "./SubmissionHistory";
import { ProblemCommentSection } from "./Comments/ProblemCommentSection";
interface RenderDescTabsProps {
  problemDetail: ProblemType | null;
  courseId: string | null;
  courseName: string | null;
  lessonId: string | null;
  lessonName: string | null;
  testCases?: TestCaseType[];
  testCasesOutput?: TestCaseType[];
  isPassed?: boolean | null;
}

export const RenderDescTabs = (props: RenderDescTabsProps) => {
  const { problemDetail, courseId, courseName, lessonId, lessonName, isPassed } = props;
  const initialTab = isPassed !== null ? (isPassed ? "Passed" : "Failed") : "Description";
  const [desActive, setDesActive] = useState(initialTab);

  useEffect(() => {
    if (isPassed !== null) {
      setDesActive(isPassed ? "Passed" : "Failed");
    }
  }, [isPassed]);

  const renderDescriptionTabButton = (tabName: string) => {
    return (
      <button
        onClick={() => setDesActive(tabName)}
        className={
          desActive === tabName
            ? "text-appAccent font-semibold text-sm md:text-base"
            : "text-gray3 font-semibold text-sm md:text-base hover:text-appAccent/80"
        }
      >
        {tabName}
      </button>
    );
  };

  const renderDescriptionTabContent = () => {
    switch (desActive) {
      case "Description":
        return (
          <ProblemDescription
            problemDetail={problemDetail}
            courseId={courseId}
            courseName={courseName}
            lessonId={lessonId}
            lessonName={lessonName}
          />
        );
      case "Comments":
        return <ProblemCommentSection />;
      case "Submissions":
        return <SubmissionHistory />;
      case "Hints":
        return <div>Hints</div>;
      case "Failed":
        return <SubmissionInformation isPassed={false} />;
      case "Passed":
        return <SubmissionInformation isPassed={true} />;
    }
  };

  return (
    <>
      <div
        id="tab-buttons"
        className="flex items-center justify-around px-2 py-3 overflow-x-scroll border-b h-18 scrollbar-hide"
      >
        {renderDescriptionTabButton("Description")}
        {renderDescriptionTabButton("Comments")}
        {renderDescriptionTabButton("Submissions")}
        {renderDescriptionTabButton("Hints")}
        {isPassed !== null && (isPassed ? renderDescriptionTabButton("Passed") : renderDescriptionTabButton("Failed"))}
      </div>
      {renderDescriptionTabContent()}
    </>
  );
};
