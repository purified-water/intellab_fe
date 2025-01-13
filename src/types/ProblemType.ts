export type ProblemType = {
  problemId: string;
  problemName: string;
  description: string;
  problemLevel: "easy" | "medium" | "hard";
  score: number;
  acceptanceRate: number;
  isAvailable: boolean;
  isPublished: boolean;
  testCases: string[];
  submissions: string[];
  solutions: string[];
};
