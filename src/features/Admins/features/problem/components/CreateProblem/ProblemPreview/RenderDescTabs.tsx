import { useEffect, useState } from "react";
import { ProblemType } from "@/types/ProblemType";
import { AdminProblemDescription } from "./AdminProblemDescriptionTab";
import { TestCaseType } from "@/features/Problem/types";
import { AdminProblemSolution } from "./AdminProblemSolutionTab";
import { SubmissionInformation } from "@/features/Problem/components";
interface AdminRenderDescTabsProps {
  problemDetail: ProblemType | null;
  testCases?: TestCaseType[];
  testCasesOutput?: TestCaseType[];
  isPassed?: boolean | null;
}

export const AdminRenderDescTabs = (props: AdminRenderDescTabsProps) => {
  const { problemDetail, isPassed } = props;
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
        type="button"
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
        return <AdminProblemDescription problemDetail={problemDetail} />;
      case "Solutions":
        return <AdminProblemSolution solutionContent={problemDetail.solution.content} />;
      // Re use components from normal problem detail
      case "Failed":
        return <SubmissionInformation isPassed={false} />;
      case "Passed":
        return <SubmissionInformation isPassed={true} />;
      default:
        return <span>No content available</span>;
    }
  };

  return (
    <>
      <div
        id="tab-buttons"
        className="flex items-center justify-around w-full px-4 py-3 space-x-2 overflow-x-scroll border-b max-h-18 scrollbar-hide shrink-0"
      >
        {renderDescriptionTabButton("Description")}
        {problemDetail &&
          problemDetail.solution &&
          problemDetail.solution.content &&
          renderDescriptionTabButton("Solutions")}
        {isPassed !== null && (isPassed ? renderDescriptionTabButton("Passed") : renderDescriptionTabButton("Failed"))}
      </div>
      {renderDescriptionTabContent()}
    </>
  );
};
