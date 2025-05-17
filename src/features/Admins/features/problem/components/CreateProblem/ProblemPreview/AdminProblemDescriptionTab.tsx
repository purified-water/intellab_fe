import { ProblemType } from "@/types/ProblemType";

import { CircleCheck } from "lucide-react";
import { LevelCard, MarkdownRender } from "@/features/Problem/components";
interface AdminProblemDescriptionProps {
  problemDetail: ProblemType | null;
}

export const AdminProblemDescription = (props: AdminProblemDescriptionProps) => {
  const { problemDetail } = props;

  return (
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      <div className="flex justify-between mt-2">
        <h1 className="text-2xl font-bold">{problemDetail?.problemName}</h1>
        {problemDetail?.isSolved && (
          <div className="flex items-center px-2 mt-1">
            <span className="mr-1 text-sm">Solved</span>
            <CircleCheck className="size-4 text-appEasy" />
          </div>
        )}
      </div>

      <LevelCard level={problemDetail?.problemLevel || ""} categories={problemDetail?.categories} />
      <MarkdownRender content={problemDetail?.description || ""} />
    </div>
  );
};
