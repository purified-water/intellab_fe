import { TestCaseType, TestCaseResultWithIO, TestCaseAfterSubmit } from "./TestCaseType";
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
  submission_id: string;
  submit_order: number;
  code: string;
  programming_language: string;
  score_achieved: number;
  problem: ProblemType;
  userUid: string;
  testCases_output: TestCaseResultWithIO[];
}

export interface SubmissionTypeNoProblem {
  submission_id: string;
  submit_order: number;
  code: string;
  programming_language: string;
  score_achieved: number;
  userUid: string;
  testCases_output: TestCaseAfterSubmit[];
}
