import { apiClient } from "@/lib/api/apiClient";
import { AdminProblemParams, GetAdminProblemResponseType } from "../features/problem/types/ProblemListType";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import {
  TCreateProblemGeneralStepResponse,
  TCreateProblemDescriptionStepResponse,
  TCreateProblemStructureStepResponse,
  TCreateProblemTestCaseStepSingleResponse,
  TCreateProblemTestCaseStepMultipleResponse,
  TCreateProblemSolutionStepResponse,
  TUpdateProblemCompletedStatusResponse,
  TCreateProblemGeneralStepParams,
  TCreateProblemDescriptionStepParams,
  TCreateProblemStructureStepParams,
  TCreateProblemTestCaseStepSingleParams,
  TCreateProblemTestCaseStepMultipleParams,
  TCreateProblemSolutionStepParams,
  TUpdateProblemCompletedStatusParams,
  TUpdateProblemAvailableStatusParams,
  TUpdateProblemAvailableStatusResponse,
  TGetTestcasesOfProblemResponse,
  TGetTestcasesOfProblemParams,
  TDeleteTestCaseResponse,
  TDeleteTestCaseParams
} from "../features/problem/types";
import { apiResponseCodeUtils } from "@/utils";
import { AxiosError } from "axios";

export const adminProblemAPI = {
  getAdminProblemList: async (params: AdminProblemParams): Promise<GetAdminProblemResponseType> => {
    const filteredParams = Object.fromEntries(
      Object.entries({
        ...params,
        // Convert categories array to comma-separated string
        categories: params.categories && params.categories.length > 0 ? params.categories.join(",") : undefined,
        sortBy: params.sort || "problemName,asc",
        size: params.size || DEFAULT_PAGE_SIZE
      }).filter(([_, value]) => value !== null && value !== undefined)
    );

    const response = await apiClient.get(`problem/admin/problems`, {
      params: filteredParams
    });
    return response.data;
  },

  createProblemGeneralStep: async ({ body, onStart, onSuccess, onFail, onEnd }: TCreateProblemGeneralStepParams) => {
    const DEFAULT_ERROR = "Error in creating problem's general step";

    const handleResponseData = async (data: TCreateProblemGeneralStepResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const response = await apiClient.post(`problem/admin/problems/general-step`, body);
      await handleResponseData(response.data as TCreateProblemGeneralStepResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TCreateProblemGeneralStepResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  createProblemDescriptionStep: async ({
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TCreateProblemDescriptionStepParams) => {
    const DEFAULT_ERROR = "Error in creating problem's description step";

    const handleResponseData = async (data: TCreateProblemDescriptionStepResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const response = await apiClient.post(`problem/admin/problems/description-step`, body);
      await handleResponseData(response.data as TCreateProblemDescriptionStepResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TCreateProblemDescriptionStepResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  createProblemStructureStep: async ({
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TCreateProblemStructureStepParams) => {
    const DEFAULT_ERROR = "Error in creating problem's structure step";

    const handleResponseData = async (data: TCreateProblemStructureStepResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const response = await apiClient.post(`problem/admin/problems/structure-step`, body);
      await handleResponseData(response.data as TCreateProblemStructureStepResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TCreateProblemStructureStepResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  createProblemTestCaseStepSingle: async ({
    query,
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TCreateProblemTestCaseStepSingleParams) => {
    const DEFAULT_ERROR = "Error in creating problem's test case (single) step";

    const handleResponseData = async (data: TCreateProblemTestCaseStepSingleResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const response = await apiClient.post(`problem/admin/problems/testcase-step`, body, {
        params: query
      });
      await handleResponseData(response.data as TCreateProblemTestCaseStepSingleResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TCreateProblemTestCaseStepSingleResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  createProblemTestCaseStepMultiple: async ({
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TCreateProblemTestCaseStepMultipleParams) => {
    const DEFAULT_ERROR = "Error in creating problem's test case (multiple) step";

    const handleResponseData = async (data: TCreateProblemTestCaseStepMultipleResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const response = await apiClient.post(`problem/admin/problems/multiple-testcase-step`, body);
      await handleResponseData(response.data as TCreateProblemTestCaseStepMultipleResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TCreateProblemTestCaseStepMultipleResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  createProblemSolutionStep: async ({
    query,
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TCreateProblemSolutionStepParams) => {
    const DEFAULT_ERROR = "Error in creating problem's solution step";

    const handleResponseData = async (data: TCreateProblemSolutionStepResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const response = await apiClient.post(`problem/admin/problems/solution-step`, body, { params: query });
      await handleResponseData(response.data as TCreateProblemSolutionStepResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TCreateProblemSolutionStepResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  updateProblemAvailableStatus: async ({
    query,
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TUpdateProblemAvailableStatusParams) => {
    const DEFAULT_ERROR = "Error updating problem available status";

    const handleResponseData = async (data: TUpdateProblemAvailableStatusResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const { problemId } = body!;
      const { availableStatus } = query!;
      const response = await apiClient.put(
        `problem/admin/problems/update-available-status/${problemId}?availableStatus=${availableStatus}`
      );
      await handleResponseData(response.data as TUpdateProblemAvailableStatusResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TUpdateProblemAvailableStatusResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  updateProblemCompletedStatus: async ({
    query,
    body,
    onStart,
    onSuccess,
    onFail,
    onEnd
  }: TUpdateProblemCompletedStatusParams) => {
    const DEFAULT_ERROR = "Error updating problem completed status";

    const handleResponseData = async (data: TUpdateProblemCompletedStatusResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const { problemId } = body!;
      const { completedCreation } = query!;
      const response = await apiClient.put(
        `problem/admin/problems/update-completed-creation-status/${problemId}?completedCreation=${completedCreation}`
      );
      await handleResponseData(response.data as TUpdateProblemCompletedStatusResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TUpdateProblemCompletedStatusResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  updateProblemPublicationStatus: async (problemId: string, isPublished: boolean) => {
    const response = await apiClient.put(
      `problem/admin/problems/update-publish-status/${problemId}?publishStatus=${isPublished}`
    );
    return response.data;
  },

  deleteProblem: async (problemId: string) => {
    const response = await apiClient.delete(`problem/admin/problems/${problemId}`);
    return response.data;
  },

  getTestcasesOfProblem: async ({ query, onStart, onSuccess, onEnd, onFail }: TGetTestcasesOfProblemParams) => {
    const DEFAULT_ERROR = "Error fetching test cases of problem";

    const handleResponseData = async (data: TGetTestcasesOfProblemResponse) => {
      await onSuccess(data);
    };

    if (onStart) {
      onStart();
    }
    try {
      const { problemId } = query!;
      const response = await apiClient.get(`problem/test-case/problem/${problemId}`);
      await handleResponseData(response.data as TGetTestcasesOfProblemResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TGetTestcasesOfProblemResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  },

  deleteTestCase: async ({ query, onStart, onSuccess, onFail, onEnd }: TDeleteTestCaseParams) => {
    const DEFAULT_ERROR = "Error deleting test case";

    const handleResponseData = async (data: TDeleteTestCaseResponse) => {
      const { code, result, message } = data;
      if (apiResponseCodeUtils.isSuccessCode(code)) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    };

    if (onStart) {
      onStart();
    }
    try {
      const { testcaseId } = query!;
      const response = await apiClient.delete(`problem/admin/problems/testcase/${testcaseId}`);
      await handleResponseData(response.data as TDeleteTestCaseResponse);
    } catch (error: unknown) {
      if (error instanceof AxiosError && apiResponseCodeUtils.isAcceptedErrorCode(error.response?.status)) {
        await handleResponseData(error.response?.data as TDeleteTestCaseResponse);
      } else if (error instanceof Error) {
        await onFail(error.message ?? DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        onEnd();
      }
    }
  }
};
