type TInputStructure = {
  type:
    | "string"
    | "float"
    | "int"
    | "bool"
    | "list<int>"
    | "list<float>"
    | "list<string>"
    | "list<bool>"
    | "list<list<int>>"
    | "list<list<float>>"
    | "list<list<string>>"
    | "list<list<bool>>";
  name: string;
};

type TOutputStructure = {
  type:
    | "string"
    | "float"
    | "int"
    | "bool"
    | "list<int>"
    | "list<float>"
    | "list<string>"
    | "list<bool>"
    | "list<list<int>>"
    | "list<list<float>>"
    | "list<list<string>>"
    | "list<list<bool>>";
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
  description: string | undefined;
  problemLevel: string;
  score: number;
  acceptanceRate: number | undefined;
  isAvailable: boolean | undefined;
  isPublished: boolean;
  problemStructure: TAdminProblemStructure | undefined;
  hasSolution: boolean;
  isCompletedCreation: boolean;
  currentCreationStep: number;
  categories: string[];
  solution: TAdminProblemSolution | undefined;
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

type TTestCaseFileContent = {
  input: string;
  output: string;
};

export type { TAdminProblem, TAdminTestCase, TAdminProblemSolution, TAdminProblemStructure, TTestCaseFileContent };
