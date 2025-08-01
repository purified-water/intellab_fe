import { useEffect, useState } from "react";
import { ProblemDescription } from "./ProblemDescription";
import { ProblemType } from "@/types/ProblemType";
import { TestCaseType } from "../../types/TestCaseType";
import { SubmissionInformation } from "./SubmissionInformation";
import { SubmissionHistory } from "./SubmissionHistory";
import { ProblemCommentSection } from "./Comments/ProblemCommentSection";
import { ProblemSolution } from "./ProblemSolution";
import { useCommentContext } from "@/hooks";
import { Spinner } from "@/components/ui";
interface RenderDescTabsProps {
  problemDetail: ProblemType | null;
  isLoadingProblemDetail?: boolean;
  courseId: string | null;
  courseName: string | null;
  lessonId: string | null;
  lessonName: string | null;
  testCases?: TestCaseType[];
  testCasesOutput?: TestCaseType[];
  isPassed?: boolean | null;
}

export const RenderDescTabs = (props: RenderDescTabsProps) => {
  const { problemDetail, isLoadingProblemDetail, courseId, courseName, lessonId, lessonName, isPassed } = props;
  const initialTab = isPassed !== null ? (isPassed ? "Passed" : "Failed") : "Description";
  const [desActive, setDesActive] = useState(initialTab);

  const redirectedCommentId = useCommentContext().commentId;

  useEffect(() => {
    if (isPassed !== null) {
      setDesActive(isPassed ? "Passed" : "Failed");
    } else {
      if (redirectedCommentId) {
        setDesActive("Comments");
      }
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

  const renderLoadingProblem = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner loading={true} />
      </div>
    );
  };

  const renderDescriptionTabContent = () => {
    if (isLoadingProblemDetail) {
      return renderLoadingProblem();
    }
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
      case "Solutions":
        return (
          <ProblemSolution
            solutionContent={problemDetail.solution.content}
            isSolved={problemDetail?.isSolved}
            viewedSolution={problemDetail?.viewedSolution}
          />
        );
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
        {problemDetail?.solution && renderDescriptionTabButton("Solutions")}
        {isPassed !== null && (isPassed ? renderDescriptionTabButton("Passed") : renderDescriptionTabButton("Failed"))}
      </div>
      {renderDescriptionTabContent()}
    </>
  );
};
