import { useEffect, useState, useCallback } from "react";
import { ListFilter } from "lucide-react";
import { useToast } from "@/hooks";
import { AlertDialog, Pagination } from "@/components/ui";
import { ProblemListItem } from "./ProblemListItem";
import { ProblemFilterType } from "@/types/ProblemType";

export type Problem = {
  id: string;
  problemName: string;
  level: "easy" | "medium" | "hard";
  categories: string[];
  publish: "private" | "public";
  submission: number;
  acceptanceRate: number;
  isCompletedCreation: boolean;
  isPublished: boolean;
};

const dummyProblemListCreated: Problem[] = [
  {
    id: "p1",
    problemName: "Two Sum",
    level: "easy",
    categories: ["array", "hashmap", "two pointers", "binary search"],
    publish: "public",
    submission: 15000,
    acceptanceRate: 0.45,
    isCompletedCreation: true,
    isPublished: false
  },
  {
    id: "p2",
    problemName: "Longest Substring Without Repeating Characters",
    level: "medium",
    categories: ["string", "sliding window"],
    publish: "public",
    submission: 12000,
    acceptanceRate: 0.37,
    isCompletedCreation: true,
    isPublished: true
  },
  {
    id: "p4",
    problemName: "Climbing Stairs",
    level: "easy",
    categories: ["dynamic programming"],
    publish: "public",
    submission: 18000,
    acceptanceRate: 0.55,
    isCompletedCreation: true,
    isPublished: true
  }
];

const dummyProblemListDraft: Problem[] = [
  {
    id: "p3",
    problemName: "Merge K Sorted Lists",
    level: "hard",
    categories: [],
    publish: "private",
    submission: 8000,
    acceptanceRate: 0.29,
    isCompletedCreation: false,
    isPublished: false
  },
  {
    id: "p5",
    problemName: "Word Ladder",
    level: "hard",
    categories: ["graph", "bfs"],
    publish: "private",
    submission: 9500,
    acceptanceRate: 0.25,
    isCompletedCreation: false,
    isPublished: false
  }
];

interface ProblemListProps {
  filter: ProblemFilterType;
  tab: string;
}

const TABLE_HEADERS = {
  common: ["Problem Name", "Level", "Categories"],
  created: ["Publish", "Submissions", "Acceptance"],
  draft: ["Created At", "Current Step"]
};

export function ProblemList({ tab }: ProblemListProps) {
  const [problems, setProblems] = useState<Problem[]>(dummyProblemListCreated);
  const [loading] = useState(false); // Handling loading problems
  const [totalPages] = useState<number | null>(null); // Later
  const [currentPage, setCurrentPage] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [, setDeletingProblem] = useState<Problem | null>(null); // Later

  const toast = useToast();

  const loadProblems = useCallback(
    async (page: number) => {
      console.log("Loading problems for tab:", tab, "Page:", page);
    },
    [tab, toast]
  );

  useEffect(() => {
    loadProblems(currentPage);
  }, [tab, currentPage, loadProblems]);

  // Dummy data for demonstration
  useEffect(() => {
    if (tab === "created") {
      setProblems(dummyProblemListCreated);
    } else if (tab === "draft") {
      setProblems(dummyProblemListDraft);
    }
  }, [tab]);

  const handleDeleteProblem = (problem: Problem) => {
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
              <div className="flex items-center gap-2">
                {header}
                <ListFilter className="size-4" />
              </div>
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
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <ProblemListItem
              key={i}
              isLoading={true}
              problem={{} as Problem}
              onDeleteProblem={handleDeleteProblem}
              onToggleProblemPublication={handleToggleProblemPublication}
            />
          ))
        ) : problems.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-5 text-center text-gray-500">
              No problems found
            </td>
          </tr>
        ) : (
          problems.map((problem) => (
            <ProblemListItem
              key={problem.id}
              problem={problem}
              isLoading={false}
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

      {totalPages && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      )}

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
