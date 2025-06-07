import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { TestcaseItem } from "./TestcaseItem";
import { CreateTestcaseSchema } from "../../../schemas";
import { TestcaseAction } from "../../../types";

interface ProblemTestcaseListProps {
  testcases: CreateTestcaseSchema[];
  onSelectTestcase?: (testcaseAction: TestcaseAction) => void;
}

export const ProblemTestcaseList = ({ testcases, onSelectTestcase }: ProblemTestcaseListProps) => {
  const [showList, setShowList] = useState(true);

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <div className={`max-w-sm p-4 bg-white ${showList ? "w-64" : "size-18"}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${showList ? "block" : "hidden"}`}>Test Case List</h2>
        <Button type="button" variant="ghost" size="icon" onClick={toggleList}>
          {showList ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      {showList && (
        <div className="overflow-y-scroll scrollbar-hide max-h-[400px]">
          <ul className="space-y-3">
            {testcases.map((testcase, index) => (
              <TestcaseItem
                key={testcase.testcaseId}
                testcase={testcase}
                onSelectTestcase={onSelectTestcase}
                index={index}
              />
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onSelectTestcase?.({ type: "create" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Test Case
        </Button>
      </div>
    </div>
  );
};
