import { TestCaseType, TestCaseResultWithIO, TestCaseAfterSubmit } from "./TestCaseType";
import { TCategory } from "@/types";

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

// MOSS plagiarism detection types
export interface MOSSResult {
  analysisId: string;
  similarityScore: number;
  status: "pending" | "analyzed" | "flagged" | "failed";
  reportUrl?: string;
  analyzedAt?: string;
  matches?: MOSSMatch[];
  threshold: number;
}

export interface MOSSMatch {
  matchId: string;
  submissionId: string;
  studentName: string;
  studentId: string;
  similarityPercentage: number;
  matchedLines: number;
  totalLines: number;
  fileUrl?: string;
  codeSnippet?: string;
}

export interface SubmissionTypeNoProblem {
  submissionId: string;
  submitOrder: number;
  code: string;
  programmingLanguage: string;
  scoreAchieved: number;
  userUid: string;
  testCasesOutput: TestCaseAfterSubmit[];
  mossResult?: MOSSResult;
  isSolved: boolean;
}
