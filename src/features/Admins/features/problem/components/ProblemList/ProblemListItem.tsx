import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";
import { Skeleton, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/shadcn";
import { capitalizeFirstLetter, shortenDate } from "@/utils";
import { GetAdminProblem } from "../../types/ProblemListType";
import { NA_VALUE } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { CREATE_PROBLEM_STEP_NUMBERS, steps } from "../../constants";

const DROP_DOWN_MENU_ITEMS = {
  EDIT: "Edit",
  CONTINUE_EDIT: "Continue Edit",
  DELETE: "Delete"
};

interface ProblemListItemProps {
  problem: GetAdminProblem;
  isLoading: boolean;
  onToggleProblemPublication: (problemId: string, isPublish: boolean) => void;
  onDeleteProblem: (Problem: GetAdminProblem) => void;
}

export function ProblemListItem(props: ProblemListItemProps) {
  const { problem, isLoading, onToggleProblemPublication, onDeleteProblem } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangeProblemPublication = async () => {
    onToggleProblemPublication(problem.problemId, !problem.isPublished);
  };

  const handleDeleteProblem = () => {
    onDeleteProblem(problem);
  };

  const handleEdit = () => {
    dispatch(
      setCreateProblem({
        problemId: problem.problemId,
        problemName: problem.problemName,
        problemDescription: problem.description,
        problemLevel: problem.problemLevel
          ? (capitalizeFirstLetter(problem.problemLevel) as "Easy" | "Medium" | "Hard")
          : "Easy",
        problemScore: problem.score,
        problemIsPublished: problem.isPublished,
        problemCategories: problem.categories,
        problemStructure: problem.problemStructure
          ? {
              functionName: problem.problemStructure.functionName,
              inputStructure: problem.problemStructure.inputStructure.map((input) => {
                return { inputName: input.name, inputType: input.type };
              }),
              outputStructure: problem.problemStructure.outputStructure.map((output) => {
                return { outputName: output.name, outputType: output.type };
              })
            }
          : {
              functionName: "",
              inputStructure: [],
              outputStructure: [{ outputName: "result", outputType: "int" }]
            },
        problemTestcases: [],
        problemSolution: problem.solution ? (problem.solution.content ?? "<Your solution goes here>") : undefined,
        currentCreationStep: problem.currentCreationStep,
        isCompletedCreation: problem.isCompletedCreation
      })
    );
    if (problem.currentCreationStep === CREATE_PROBLEM_STEP_NUMBERS.PREVIEW) {
      navigate("/admin/problems/create/general?editProblem=true");
    } else {
      navigate(`/admin/problems/create/${steps[problem.currentCreationStep - 1].path}?editProblem=true`);
    }
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.EDIT:
        case DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT:
          handleEdit();
          break;
        case DROP_DOWN_MENU_ITEMS.DELETE:
          handleDeleteProblem();
          break;
        default:
          break;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-24 min-w-[130px] shadow-lg">
          {[
            problem.isCompletedCreation ? DROP_DOWN_MENU_ITEMS.EDIT : DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT,
            DROP_DOWN_MENU_ITEMS.DELETE
          ].map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleDropdownMenuItemClick(action)}
              className={`text-sm py-1.5 px-3 cursor-pointer  focus:bg-gray6 ${action === DROP_DOWN_MENU_ITEMS.DELETE ? "text-appHard" : ""}`}
            >
              {action}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderLoading = () => {
    return (
      <tr className="text-base border-b border-gray5">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <td key={index} className="py-1">
              <Skeleton className={index === 5 ? "w-1/4 h-8" : index === 6 ? "size-4" : "w-[80%] h-8"} />
            </td>
          ))}
      </tr>
    );
  };

  const renderContent = () => {
    return (
      <>
        <tr key={problem.problemId} className="text-base border-b border-gray5">
          <td className="py-1 w-[320px] max-w-[320px] overflow-hidden pr-2 truncate">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block truncate">{problem.problemName}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">{problem.problemName}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </td>
          {problem.problemLevel && (
            <td
              className={`py-1 font-medium ${
                problem.problemLevel === "easy"
                  ? "text-appEasy"
                  : problem.problemLevel === "medium"
                    ? "text-appMedium"
                    : "text-appHard"
              }`}
            >
              {capitalizeFirstLetter(problem.problemLevel)}
            </td>
          )}
          <td className="py-1">
            <div
              className="truncate max-w-[200px]"
              title={problem.categories?.map((category) => category.name).join(", ") ?? ""}
            >
              {problem.categories?.map((category) => category.name).join(", ") ?? ""}
            </div>
          </td>
          {problem.isCompletedCreation && (
            <>
              <td className="py-1">
                <div className="flex justify-center">
                  <Switch
                    checked={problem.isPublished}
                    onCheckedChange={handleChangeProblemPublication}
                    className="data-[state=checked]:bg-appPrimary data-[state=unchecked]:bg-gray5"
                  />
                </div>
              </td>
              <td className="py-1 pr-8 text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">{problem.problemSubmissionStat?.total ?? 0}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        Passed: {problem.problemSubmissionStat?.pass ?? 0} | Failed:
                        {problem.problemSubmissionStat?.fail ?? 0}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
              <td className="py-1 pr-8 text-right">
                {problem.acceptanceRate !== undefined ? `${(problem.acceptanceRate * 100).toFixed(0)}%` : "0%"}
              </td>
            </>
          )}

          {!problem.isCompletedCreation && <td className="py-1">{shortenDate(problem.createdAt) || NA_VALUE}</td>}
          {!problem.isCompletedCreation && <td className="py-1">{problem.currentCreationStepDescription}</td>}
          <td className="px-5 py-1">{renderDropdownMenu()}</td>
        </tr>
      </>
    );
  };

  return isLoading ? renderLoading() : renderContent();
}
