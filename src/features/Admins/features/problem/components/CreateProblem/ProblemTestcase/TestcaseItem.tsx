import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui";
import { CreateTestcaseSchema } from "../../../schemas";
import { TestcaseAction } from "../../../types";

interface TestcaseItemProps {
  testcase: CreateTestcaseSchema;
  selectedTestcaseId?: string;
  onSelectTestcase?: (testcaseAction: TestcaseAction) => void;
}

export const TestcaseItem = ({ testcase, selectedTestcaseId, onSelectTestcase }: TestcaseItemProps) => {
  const handleAction = (action: TestcaseAction) => {
    const { type, testcaseId } = action;
    if (!action) return;

    switch (type) {
      case "view":
        if (onSelectTestcase) {
          onSelectTestcase({ type: "view", testcaseId });
        }
        break;
      case "edit":
        if (onSelectTestcase) {
          onSelectTestcase({ type: "edit", testcaseId });
        }
        break;
      case "delete":
        if (onSelectTestcase) {
          onSelectTestcase({ type: "delete", testcaseId });
        }
        break;
      default:
        console.error("Unknown action type:", type);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 border rounded-lg hover:bg-muted cursor-pointer ${selectedTestcaseId === testcase.testcaseId ? "bg-purple-100 border-appFadedPrimary" : ""}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent overriding actions from dropdown menu
        onSelectTestcase?.({
          type: "view",
          testcaseId: testcase.testcaseId
        } as TestcaseAction);
      }}
    >
      <span className="text-sm font-medium line-clamp-1">{testcase.testcaseId}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div onPointerDown={(e) => e.stopPropagation()}>
            <MoreVertical className="cursor-pointer size-4 shrink-0 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent onPointerDown={(e) => e.stopPropagation()}>
          {["view", "edit", "delete"].map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent div's onClick from triggering
                handleAction({ type: action, testcaseId: testcase.testcaseId } as TestcaseAction);
              }}
              className={action === "delete" ? "text-appHard" : ""}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
