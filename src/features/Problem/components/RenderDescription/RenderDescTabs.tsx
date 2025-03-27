import { useEffect, useState } from "react";
import { ProblemDescription } from "./ProblemDescription";
import { ProblemType } from "@/types/ProblemType";
import { TestCaseType } from "../../types/TestCaseType";
import { SubmissionInformation } from "./SubmissionInformation";
import { SubmissionHistory } from "./SubmissionHistory";
import { ProblemCommentSection } from "./Comments/ProblemCommentSection";
import { ProblemSolution } from "./ProblemSolution";
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
    if (!problemDetail) return null;

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
      case "Solution":
        return <ProblemSolution solutionContent={problemDetail.solution.content} />;
      case "Failed":
        return <SubmissionInformation isPassed={false} />;
      case "Passed":
        return <SubmissionInformation isPassed={true} />;
      default:
        return (
          <ProblemDescription
            problemDetail={problemDetail}
            courseId={courseId}
            courseName={courseName}
            lessonId={lessonId}
            lessonName={lessonName}
          />
        );
    }
  };

  return (
    <>
      <div
        id="tab-buttons"
        className="flex items-center justify-around w-full px-4 py-3 space-x-2 overflow-x-scroll border-b max-h-18 scrollbar-hide shrink-0"
      >
        {renderDescriptionTabButton("Description")}
        {renderDescriptionTabButton("Comments")}
        {renderDescriptionTabButton("Submissions")}
        {renderDescriptionTabButton("Solution")}
        {isPassed !== null && (isPassed ? renderDescriptionTabButton("Passed") : renderDescriptionTabButton("Failed"))}
      </div>
      {renderDescriptionTabContent()}
    </>
  );
};
