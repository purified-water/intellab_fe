import { useState } from "react";
import { AlertDialog, EmptyList } from "@/components/ui";
import { ProblemListItem } from "./ProblemListItem";
import { AdminProblemParams, GetAdminProblem } from "../../types/ProblemListType";
interface ProblemListProps {
  problems: GetAdminProblem[];
  filter: AdminProblemParams;
  isLoading: boolean;
  tab: string;
}

const TABLE_HEADERS = {
  common: ["Problem Name", "Level", "Categories"],
  created: ["Publish", "Submissions", "Acceptance"],
  draft: ["Created At", "Current Step"]
};

export function ProblemList({ problems, isLoading, tab }: ProblemListProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [, setDeletingProblem] = useState<GetAdminProblem | null>(null); // Later

  const handleDeleteProblem = (problem: GetAdminProblem) => {
    setDeletingProblem(problem);
    setTimeout(() => setOpenDeleteDialog(true), 0);
  };

  const handleToggleProblemPublication = async (problemId: string, isPublish: boolean) => {
    console.log("Toggle publication for problem:", problemId, isPublish);
  };

  const renderHeader = () => {
    const extraHeaders = tab === "created" ? TABLE_HEADERS.created : TABLE_HEADERS.draft;

    return (
      <thead className="text-left border-t border-b border-gray5">
        <tr>
          {[...TABLE_HEADERS.common, ...extraHeaders].map((header) => (
            <th key={header} className="py-4">
              <div className="flex items-center gap-2">{header}</div>
            </th>
          ))}
          <th />
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    return (
      <tbody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <ProblemListItem
              key={i}
              isLoading={true}
              problem={{} as GetAdminProblem}
              onDeleteProblem={() => {}}
              onToggleProblemPublication={() => {}}
            />
          ))
        ) : problems.length === 0 ? (
          <tr>
            <td
              colSpan={
                TABLE_HEADERS.common.length +
                (tab === "created" ? TABLE_HEADERS.created.length : TABLE_HEADERS.draft.length) +
                1
              }
            >
              <div className="flex justify-center py-8">
                <EmptyList message="No problems found." />
              </div>
            </td>
          </tr>
        ) : (
          problems.map((problem) => (
            <ProblemListItem
              key={problem.problemId}
              problem={problem}
              isLoading={isLoading}
              onDeleteProblem={handleDeleteProblem}
              onToggleProblemPublication={handleToggleProblemPublication}
            />
          ))
        )}
      </tbody>
    );
  };

  return (
    <div>
      <table className="w-full">
        {renderHeader()}
        {renderBody()}
      </table>

      <AlertDialog
        open={openDeleteDialog}
        title="Delete Problem"
        message="This action cannot be undone."
        onConfirm={() => {
          // Call your delete API
          setOpenDeleteDialog(false);
        }}
        onCancel={() => setOpenDeleteDialog(false)}
      />
    </div>
  );
}
