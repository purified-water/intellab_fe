import { RenderMarkdown } from "@/components/Markdown";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/shadcn";
import { useEffect, useState } from "react";

interface Problem {
  problemId: string;
  title: string;
  level: string;
  categories: string[];
  description: string;
}

const mockProblems: Problem[] = [
  {
    problemId: "1",
    title: "Two sum",
    level: "Easy",
    categories: ["category 08", "category 1", "category 5"],
    description: "You are given an array of integers..."
  },
  {
    problemId: "2",
    title: "Plus one",
    level: "Easy",
    categories: ["category 08", "category 1", "category 5"],
    description: "You are given a large integer represented as an integer array digits..."
  }
];

interface AddProblemProps {
  value: string;
  onChange: (problemId: string) => void;
  readOnly?: boolean;
}

export const AddProblem = ({ value, onChange, readOnly }: AddProblemProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  const confirmedProblemId = value ?? null;

  const filteredProblems = mockProblems.filter((problem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProblem = mockProblems.find((p) => p.problemId === selectedProblemId);

  const handleConfirm = (problem: Problem) => {
    onChange(problem.problemId);
  };

  useEffect(() => {
    if (confirmedProblemId) setSelectedProblemId(confirmedProblemId);
  }, [confirmedProblemId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Search & List */}
        <div className="col-span-1 space-y-4">
          <Input
            placeholder="Search..."
            disabled={readOnly}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="space-y-2 overflow-y-auto max-h-[600px]">
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
                  <span className="font-medium">{problem.title}</span>
                  <span className="px-2 py-1 text-xs text-green-800 bg-green-200 rounded-full">{problem.level}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {problem.categories.map((cat, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray5">
                      {cat}
                    </span>
                  ))}
                </div>
                {confirmedProblemId === problem.problemId && (
                  <div className="mt-2 text-sm font-semibold text-appEasy">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="col-span-2">
          {selectedProblem && (
            <div className="p-6 space-y-4 border rounded-xl">
              <h3 className="text-lg font-semibold">Problem description</h3>
              <div className="h-full overflow-y-scroll text-sm text-gray1">
                <RenderMarkdown content={selectedProblem.description} />
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
