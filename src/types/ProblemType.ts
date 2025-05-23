import { TestCaseType } from "@/features/Problem/types/TestCaseType";
export type ProblemSolutionType = {
  problemId: string;
  content: string;
};

export type ProblemCategoryType = {
  categoryId: string;
  name: string;
};

export type ProblemType = {
  problemId: string;
  categories: ProblemCategoryType[];
  problemName: string;
  description: string;
  problemLevel: "easy" | "medium" | "hard";
  score: number;
  acceptanceRate: number;
  isAvailable: boolean;
  isPublished: boolean;
  isSolved: boolean;
  testCases: TestCaseType[];
  submissions: string[];
  solution: ProblemSolutionType;
  viewedSolution: boolean;
};

export type ProblemFilterType = {
  keyword?: string;
  level?: "easy" | "medium" | "hard" | null;
  status?: "done" | "not done" | null;
  categories?: ProblemCategoryType[] | null;
};
