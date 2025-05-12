import { Button, Spinner } from "@/components/ui";
import { Input } from "@/components/ui/shadcn";
import { useEffect, useState } from "react";
import { useCreateLesson } from "../../../hooks";
import { CreateLessonProblemResponse } from "@/types";
import { MarkdownRender } from "@/features/Problem/components";
import { CircleCheck } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils";
interface AddProblemProps {
  value: string;
  onChange: (problemId: string) => void;
  readOnly?: boolean;
}

export const AddProblem = ({ value, onChange, readOnly }: AddProblemProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const createCourseLesson = useCreateLesson();
  const { data: problems, isLoading } = createCourseLesson.getProblems;

  if (!problems) return null;

  const confirmedProblemId = value ?? null;

  // MISSING PROBLEM NAME, USED FOR TESTING
  const filteredProblems = problems.filter((problem) =>
    problem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProblem = problems.find((p) => p.problemId === selectedProblemId);

  const handleConfirm = (problem: CreateLessonProblemResponse) => {
    onChange(problem.problemId);
  };

  useEffect(() => {
    if (confirmedProblemId) setSelectedProblemId(confirmedProblemId);
  }, [confirmedProblemId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {isLoading ? (
          <Spinner className="col-span-3" loading={isLoading} />
        ) : (
          <div className="col-span-1 space-y-4">
            <Input
              placeholder="Search..."
              disabled={readOnly}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-2 overflow-y-auto max-h-[600px] scrollbar-hide">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.problemId}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                    selectedProblemId === problem.problemId
                      ? "bg-purple-100 border-appFadedPrimary"
                      : confirmedProblemId === problem.problemId
                        ? "bg-green-100 border-appEasy"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedProblemId(problem.problemId)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{problem.problemName}</span>
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-200 rounded-full">
                      {capitalizeFirstLetter(problem.level)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {problem.categories.map((cat, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray5">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  {confirmedProblemId === problem.problemId && (
                    <div className="flex items-center mt-2 text-sm font-semibold text-appEasy">
                      <CircleCheck className="mr-1 size-4" /> Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right: Preview */}
        <div className="col-span-2">
          {selectedProblem && (
            <div className="p-6 space-y-4 border rounded-xl">
              <h3 className="text-lg font-semibold">Problem description</h3>
              <div className="h-full overflow-y-scroll text-sm text-gray1">
                <MarkdownRender content={selectedProblem.description} />
              </div>
              <div className="text-right">
                <Button
                  disabled={readOnly}
                  type="button"
                  className="bg-appPrimary hover:bg-appPrimary/80"
                  onClick={() => handleConfirm(selectedProblem)}
                >
                  Select
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
