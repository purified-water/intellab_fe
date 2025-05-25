import { TApiResponse, TPostApiParams } from "@/types";
import { TAdminProblem, TAdminTestCase, TAdminProblemSolution, TAdminProblemStructure } from "./adminProblemTypes";

type TCreateProblemGeneralStepResponse = TApiResponse<TAdminProblem>;

type TCreateProblemDescriptionStepResponse = TApiResponse<TAdminProblem>;

type TCreateProblemStructureStepResponse = TApiResponse<TAdminProblem>;

type TCreateProblemTestCaseStepSingleResponse = TApiResponse<TAdminTestCase>;

type TCreateProblemTestCaseStepMultipleResponse = TApiResponse<TAdminTestCase[]>;

type TCreateProblemSolutionStepResponse = TApiResponse<TAdminProblemSolution>;

type TUpdateProblemCompletedStatusResponse = TApiResponse<TAdminProblem>;

type TUpdateProblemAvailableStatusResponse = TApiResponse<TAdminProblem>;

type TCreateProblemGeneralStepParams = TPostApiParams<
  undefined,
  {
    problemName: string;
    categories: number[];
    problemLevel: string;
    score: number;
    isPublished: boolean;
  },
  TAdminProblem
>;

type TCreateProblemDescriptionStepParams = TPostApiParams<
  undefined,
  {
    problemId: string;
    description: string;
  },
  TAdminProblem
>;

type TCreateProblemStructureStepParams = TPostApiParams<
  undefined,
  {
    problemId: string;
    problemStructure: TAdminProblemStructure;
  },
  TAdminProblem
>;

type TCreateProblemTestCaseStepSingleParams = TPostApiParams<
  undefined,
  {
    problemId: string;
    input: string;
    output: string;
  },
  TAdminTestCase
>;

type TCreateProblemTestCaseStepMultipleParams = TPostApiParams<
  undefined,
  {
    problemId: string;
    inputs: string[];
    outputs: string[];
  },
  TAdminTestCase[]
>;

type TCreateProblemSolutionStepParams = TPostApiParams<
  undefined,
  {
    problemId: string;
    content: string;
    authorId: string;
  },
  TAdminProblemSolution
>;

type TUpdateProblemCompletedStatusParams = TPostApiParams<
  {
    completedCreation: boolean;
  },
  {
    problemId: string;
  },
  TAdminProblem
>;

type TUpdateProblemAvailableStatusParams = TPostApiParams<
  {
    availableStatus: boolean;
  },
  {
    problemId: string;
  },
  TAdminProblem
>;

export type {
  TCreateProblemGeneralStepResponse,
  TCreateProblemDescriptionStepResponse,
  TCreateProblemStructureStepResponse,
  TCreateProblemTestCaseStepSingleResponse,
  TCreateProblemTestCaseStepMultipleResponse,
  TCreateProblemSolutionStepResponse,
  TUpdateProblemCompletedStatusResponse,
  TUpdateProblemAvailableStatusResponse,
  TCreateProblemGeneralStepParams,
  TCreateProblemDescriptionStepParams,
  TCreateProblemStructureStepParams,
  TCreateProblemTestCaseStepSingleParams,
  TCreateProblemTestCaseStepMultipleParams,
  TCreateProblemSolutionStepParams,
  TUpdateProblemCompletedStatusParams,
  TUpdateProblemAvailableStatusParams
};
