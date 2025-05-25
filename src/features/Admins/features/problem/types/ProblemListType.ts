import { APIMetaData, APIResponseCode, TCategory } from "@/types";

export type ProblemSubmissionStat = {
  total: number;
  pass: number;
  fail: number;
};

export type GetAdminProblem = {
  problemId: string;
  problemName: string;
  description: string;
  problemLevel: "easy" | "medium" | "hard";
  categories: TCategory[];
  score: number;
  acceptanceRate: number;
  isAvailable: boolean;
  isPublished: boolean;
  hasSolution: boolean;
  isCompletedCreation: boolean;
  currentCreationStep: number;
  createdAt: string;
  problemSubmissionStat: ProblemSubmissionStat;
};

export type GetAdminProblemResponseType = APIResponseCode & {
  result: {
    content: GetAdminProblem[];
  } & APIMetaData;
};

export type AdminProblemParams = {
  isComplete: boolean;
  searchKey?: string;
  page?: number;
  size?: number;
  sort?: string;
};
