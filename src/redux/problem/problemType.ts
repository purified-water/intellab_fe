import { Problem } from "@/features/Problem/types";

export interface ProblemState {
  problems: Problem[];
  status: string;
  currentPage: number;
  totalPages: number;
  pageSize: number; // Default page size
  exploreProblems: Problem[];
  originalExploreProblems: Problem[];
  hasFilter: boolean;
}
export interface UserCodeState {
  codeByProblemId: {
    [problemId: string]: { code: string; language: string };
  };
}
