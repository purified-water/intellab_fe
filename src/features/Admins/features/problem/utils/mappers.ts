import { ProblemType } from "@/types/ProblemType";
import { CreateProblemSchema, CreateTestcaseSchema } from "../schemas";
import { TestCaseType } from "@/features/Problem/types";

export const mapCreateTestcaseSchemaToTestcaseType = (testcase: CreateTestcaseSchema): TestCaseType => {
  return {
    testCaseId: testcase.testcaseId,
    input: testcase.testcaseInput,
    output: testcase.expectedOutput,
    order: testcase.testcaseOrder,
    userId: null,
    submitOutputs: []
  };
};

export const mapCreateProblemSchemaToProblemType = (createProblem: CreateProblemSchema): ProblemType => {
  return {
    problemId: createProblem.problemId,
    categories: createProblem.problemCategories.map((category) => ({
      categoryId: category.categoryId.toString(),
      name: category.name
    })),
    problemName: createProblem.problemName,
    description: createProblem.problemDescription,
    problemLevel: createProblem.problemLevel.toLowerCase() as "easy" | "medium" | "hard",
    score: createProblem.problemScore,
    acceptanceRate: 0,
    isAvailable: true,
    isPublished: createProblem.problemIsPublished,
    isSolved: false,
    testCases: createProblem.problemTestcases.map((testcase) => {
      return mapCreateTestcaseSchemaToTestcaseType(testcase);
    }),
    submissions: [],
    solution: {
      problemId: createProblem.problemId,
      content: createProblem.problemSolution
    },
    viewedSolution: false
  };
};
