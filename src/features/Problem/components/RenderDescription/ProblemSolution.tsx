import { RenderMarkdown } from "@/components/Markdown";
import { LockProblemSolutionOverlay } from "./LockProblemSolutionOverlay";
import { useState } from "react";

interface ProblemSolutionProps {
  solutionContent: string;
}
export const ProblemSolution = ({ solutionContent }: ProblemSolutionProps) => {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlockBeforeSolved = () => {
    setIsLocked(false);
  };

  return (
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      {isLocked ? (
        <LockProblemSolutionOverlay unlockBeforeSolved={handleUnlockBeforeSolved} />
      ) : (
        <RenderMarkdown content={solutionContent} />
      )}
    </div>
  );
};
