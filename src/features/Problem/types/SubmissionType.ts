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
  matchCode: string;
  percent: number;
  submissionId1: string; // User submission
  submissionId2: string; // Other user submission
  userId1: string; // User ID of the first submission
  userId2: string; // User ID of the second submission
  username2: string; // Username of the second submission
  reportUrl: string; // URL to the MOSS report
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
  mossResults?: MOSSResult[];
  isSolved: boolean;
}
