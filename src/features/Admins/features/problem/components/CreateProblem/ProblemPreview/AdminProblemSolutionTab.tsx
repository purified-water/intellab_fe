import { RenderMarkdown } from "@/components/Markdown";

interface AdminProblemSolutionProps {
  solutionContent: string;
}
export const AdminProblemSolution = ({ solutionContent }: AdminProblemSolutionProps) => {
  return (
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      <RenderMarkdown content={solutionContent} />
    </div>
  );
};
