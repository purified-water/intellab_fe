type TInputStructure = {
  type: string;
  name: string;
};

type TOutputStructure = {
  type: string;
  name: string;
};

type TAdminProblemStructure = {
  problemName: string;
  functionName: string;
  inputStructure: TInputStructure[];
  outputStructure: TOutputStructure[];
};

type TAdminProblem = {
  problemId: string;
  problemName: string;
  description: string;
  problemLevel: string;
  score: number;
  acceptanceRate: number;
  isAvailable: boolean;
  isPublished: boolean;
  problemStructure: TAdminProblemStructure;
  hasSolution: boolean;
  isCompletedCreation: boolean;
  currentCreationStep: number;
  categories: string[];
};

type TAdminTestCase = {
  testcaseId: string;
  input: string;
  output: string;
  order: number;
};

type TAdminProblemSolution = {
  content: string;
  problemId: string;
  authorId: string;
};

export type { TAdminProblem, TAdminTestCase, TAdminProblemSolution, TAdminProblemStructure };
