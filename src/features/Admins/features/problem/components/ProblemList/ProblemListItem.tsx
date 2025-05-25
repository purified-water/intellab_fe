import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";
import { Skeleton, Switch } from "@/components/ui/shadcn";
import { Problem } from "./ProblemList";
import { capitalizeFirstLetter } from "@/utils";

const DROP_DOWN_MENU_ITEMS = {
  VIEW: "View",
  EDIT: "Edit",
  CONTINUE_EDIT: "Continue Edit",
  DELETE: "Delete"
};

interface ProblemListItemProps {
  problem: Problem;
  isLoading: boolean;
  onToggleProblemPublication: (problemId: string, isPublish: boolean) => void;
  onDeleteProblem: (course: Problem) => void;
}

export function ProblemListItem(props: ProblemListItemProps) {
  const { problem, isLoading, onToggleProblemPublication, onDeleteProblem } = props;

  const handleChangeProblemPublication = async () => {
    console.log("handleChangeProblemPublication");
    onToggleProblemPublication(problem.id, !problem.isPublished);
  };

  const handleViewDetails = () => {
    console.log("View Details clicked for item:");
  };

  const handleDeleteCourse = () => {
    onDeleteProblem(problem);
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.VIEW:
          handleViewDetails();
          break;
        case DROP_DOWN_MENU_ITEMS.EDIT:
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
            problem.isCompletedCreation ? DROP_DOWN_MENU_ITEMS.EDIT : DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT,
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
        <tr key={problem.id} className="text-base border-b border-gray5">
          <td className="px-2 py-1 max-w-[300px] truncate">{problem.problemName}</td>
          <td
            className={`px-2 py-1 font-medium ${
              problem.level === "easy" ? "text-appEasy" : problem.level === "medium" ? "text-appMedium" : "text-appHard"
            }`}
          >
            {capitalizeFirstLetter(problem.level)}
          </td>
          <td className="px-2 py-1">
            <div
              className="truncate max-w-[200px]"
              title={problem.categories?.map((category) => category).join(", ") ?? ""}
            >
              {problem.categories?.map((category) => category).join(", ") ?? ""}
            </div>
          </td>
          {problem.isCompletedCreation && (
            <>
              <td className="px-2 py-1">
                <div className="">
                  <Switch
                    checked={problem.isPublished}
                    onCheckedChange={handleChangeProblemPublication}
                    className="data-[state=checked]:bg-appPrimary data-[state=unchecked]:bg-gray5"
                  />
                </div>
              </td>
              <td className="px-2 py-1">{problem.submission}</td>
              <td className="px-2 py-1">{problem.acceptanceRate}</td>
            </>
          )}

          {!problem.isCompletedCreation && <td className="px-2 py-1">{"Gurt"}</td>}
          {!problem.isCompletedCreation && <td className="px-2 py-1">{"Current step"}</td>}
          <td className="px-5 py-1">{renderDropdownMenu()}</td>
        </tr>
      </>
    );
  };

  return isLoading ? renderLoading() : renderContent();
}
