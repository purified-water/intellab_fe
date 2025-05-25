import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";
import { Skeleton, Switch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/shadcn";
import { capitalizeFirstLetter, formatDateInProblem } from "@/utils";
import { GetAdminProblem } from "../../types/ProblemListType";
import { NA_VALUE } from "@/constants";

const DROP_DOWN_MENU_ITEMS = {
  VIEW: "View",
  MODIFY: "Modify",
  CONTINUE_EDIT: "Continue Edit",
  DELETE: "Delete"
};

interface ProblemListItemProps {
  problem: GetAdminProblem;
  isLoading: boolean;
  onToggleProblemPublication: (problemId: string, isPublish: boolean) => void;
  onDeleteProblem: (course: GetAdminProblem) => void;
}

export function ProblemListItem(props: ProblemListItemProps) {
  const { problem, isLoading, onToggleProblemPublication, onDeleteProblem } = props;

  const handleChangeProblemPublication = async () => {
    console.log("handleChangeProblemPublication");
    onToggleProblemPublication(problem.problemId, !problem.isPublished);
  };

  const handleViewDetails = () => {
    console.log("View Details clicked for item:");
  };

  console.log("ProblemListItem rendered with problem:", problem);

  const handleDeleteCourse = () => {
    onDeleteProblem(problem);
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.VIEW:
          handleViewDetails();
          break;
        case DROP_DOWN_MENU_ITEMS.MODIFY:
          console.log("Modify clicked for item:");
          break;
        case DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT:
          console.log("Continue Edit clicked for item:");
          break;
        case DROP_DOWN_MENU_ITEMS.DELETE:
          handleDeleteCourse();
          break;
        default:
          break;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-24 min-w-[130px] shadow-lg">
          {[
            DROP_DOWN_MENU_ITEMS.VIEW,
            problem.isCompletedCreation ? DROP_DOWN_MENU_ITEMS.MODIFY : DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT,
            DROP_DOWN_MENU_ITEMS.DELETE
          ].map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleDropdownMenuItemClick(action)}
              className="text-sm py-1.5 px-3 cursor-pointer  focus:bg-gray6"
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
            <td key={index} className="px-2 py-1">
              <Skeleton className={index === 5 ? "w-1/4 h-4" : index === 6 ? "size-4" : "w-[80%] h-4"} />
            </td>
          ))}
      </tr>
    );
  };

  const renderContent = () => {
    return (
      <>
        <tr key={problem.problemId} className="text-base border-b border-gray5">
          <td className="px-2 py-1 max-w-[300px] truncate">{problem.problemName}</td>
          <td
            className={`px-2 py-1 font-medium ${
              problem.problemLevel === "easy"
                ? "text-appEasy"
                : problem.problemLevel === "medium"
                  ? "text-appMedium"
                  : "text-appHard"
            }`}
          >
            {capitalizeFirstLetter(problem.problemLevel)}
          </td>
          <td className="px-2 py-1">
            <div
              className="truncate max-w-[200px]"
              title={problem.categories?.map((category) => category.name).join(", ") ?? ""}
            >
              {problem.categories?.map((category) => category.name).join(", ") ?? ""}
            </div>
          </td>
          {problem.isCompletedCreation && (
            <>
              <td className="px-2 py-1">
                <Switch
                  checked={problem.isPublished}
                  onCheckedChange={handleChangeProblemPublication}
                  className="data-[state=checked]:bg-appPrimary data-[state=unchecked]:bg-gray5"
                />
              </td>
              <td className="px-2 py-1">
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
              </td>{" "}
              <td className="px-2 py-1">{problem.acceptanceRate}%</td>
            </>
          )}

          {!problem.isCompletedCreation && (
            <td className="px-2 py-1">{formatDateInProblem(problem.createdAt) || NA_VALUE}</td>
          )}
          {!problem.isCompletedCreation && <td className="px-2 py-1">{problem.currentCreationStep}</td>}
          <td className="px-5 py-1">{renderDropdownMenu()}</td>
        </tr>
      </>
    );
  };

  return isLoading ? renderLoading() : renderContent();
}
