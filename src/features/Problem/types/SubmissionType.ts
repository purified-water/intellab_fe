import { TestCaseType, TestCaseResultWithIO, TestCaseAfterSubmit } from "./TestCaseType";
import { TCategory } from "@/types/category";

export interface ProblemType {
  problemId: string;
  problemName: string;
  description: string;
  problemLevel: string;
  score: number;
  acceptanceRate: number;
  isAvailable: boolean;
  isPublished: boolean;
  solutionStructure: string;
  testCases: TestCaseType[];
  submissions: string[];
  solutions: SolutionType[];
  categories: TCategory[];
}

export interface SolutionType {
  solution_id: {
    problem_id: string;
    author_id: string;
  };
  content: string;
  problem: string;
  user_id: string;
}

export interface SendSubmissionType {
  submissionId: string;
  submitOrder: number;
  code: string;
  programmingLanguage: string;
  scoreAchieved: number;
  problem: ProblemType;
  userUid: string;
  testCasesOutput: TestCaseResultWithIO[];
  isSolved: boolean;
  submitDate: string;
  usedMemory: number;
  runTime: number;
}

export interface SubmissionTypeNoProblem {
  submissionId: string;
  submitOrder: number;
  code: string;
  programmingLanguage: string;
  scoreAchieved: number;
  userUid: string;
  testCasesOutput: TestCaseAfterSubmit[];
}
