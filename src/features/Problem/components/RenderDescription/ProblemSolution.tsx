import { RenderMarkdown } from "@/components/Markdown";

interface ProblemSolutionProps {
  solutionContent: string;
}
export const ProblemSolution = ({ solutionContent }: ProblemSolutionProps) => {
  return (
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      <RenderMarkdown content={solutionContent} />
    </div>
  );
};
