import { Problem } from "@/pages/ProblemsPage/types/resonseType";

export interface ProblemState {
  problems: Problem[];
  status: string;
  currentPage: number;
  totalPages: number;
  pageSize: number; // Default page size
}
export interface UserCodeState {
  codeByProblemId: {
    [problemId: string]: { code: string; language: string };
  };
}
