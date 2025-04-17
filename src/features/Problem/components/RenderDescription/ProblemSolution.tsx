import { RenderMarkdown } from "@/components/Markdown";
import { LockProblemSolutionOverlay } from "./LockProblemSolutionOverlay";
import { problemAPI } from "@/lib/api";
import { useParams } from "react-router-dom";
import { useState } from "react";

interface ProblemSolutionProps {
  solutionContent: string;
  isSolved: boolean;
  viewedSolution: boolean;
}
export const ProblemSolution = ({ solutionContent, isSolved, viewedSolution }: ProblemSolutionProps) => {
  const { problemId } = useParams<{ problemId: string }>();
  const [viewedSolutionState, setViewedSolutionState] = useState(viewedSolution);

  const handleUnlockBeforeSolved = async () => {
    if (!problemId) return;
    // Call the API to unlock the solution
    try {
      // If user hasmt solved but already view then dont call api
      if (!isSolved && !viewedSolution) {
        await problemAPI.postViewSolutionBeforePassed(problemId);
        setViewedSolutionState(true);
      }
    } catch (error) {
      console.log("Error unlocking solution:", error);
    }
  };
  return (
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      {!isSolved && !viewedSolutionState ? (
        <LockProblemSolutionOverlay unlockBeforeSolved={handleUnlockBeforeSolved} />
      ) : (
        <RenderMarkdown content={solutionContent} />
      )}
    </div>
  );
};
