import { Problem } from "@/pages/ProblemsPage/types/resonseType";

export interface ProblemState {
  problems: Problem[];
  status: string;
  currentPage: number;
  totalPages: number;
  pageSize: number; // Default page size
}
