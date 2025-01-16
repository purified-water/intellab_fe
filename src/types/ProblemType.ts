import { TestCaseType } from "@/features/Problem/types/TestCaseType";

export type ProblemType = {
  problemId: string;
  problemName: string;
  description: string;
  problemLevel: "easy" | "medium" | "hard";
  score: number;
  acceptanceRate: number;
  isAvailable: boolean;
  isPublished: boolean;
  testCases: TestCaseType[];
  submissions: string[];
  solutions: string[];
};
