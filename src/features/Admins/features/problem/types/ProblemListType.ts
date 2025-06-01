import { APIMetaData, APIResponseCode, TCategory } from "@/types";
import { TAdminProblemStructure, TAdminProblemSolution } from "./adminProblemTypes";

export type ProblemSubmissionStat = {
  total: number;
  pass: number;
  fail: number;
};

export type GetAdminProblem = {
  problemId: string;
  problemName: string;
  description: string | undefined;
  problemLevel: "easy" | "medium" | "hard";
  categories: TCategory[];
  score: number;
  acceptanceRate: number | undefined;
  isAvailable: boolean | undefined;
  isPublished: boolean;
  hasSolution: boolean;
  isCompletedCreation: boolean;
  currentCreationStep: number;
  createdAt: string;
  problemSubmissionStat: ProblemSubmissionStat | undefined;
  problemStructure: TAdminProblemStructure;
  solution: TAdminProblemSolution | undefined;
  currentCreationStepDescription: string | undefined;
};

export type GetAdminProblemResponseType = APIResponseCode & {
  result: {
    content: GetAdminProblem[];
  } & APIMetaData;
};

export type AdminProblemParams = {
  isComplete: boolean;
  searchKey?: string;
  level?: "" | "easy" | "medium" | "hard";
  isPublished?: boolean;
  categories?: TCategory[];
  page?: number;
  size?: number;
  sort?: string;
};
