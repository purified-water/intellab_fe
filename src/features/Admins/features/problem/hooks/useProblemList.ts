import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProblemAPI } from "@/features/Admins/api";
import { AdminProblemParams, GetAdminProblem, GetAdminProblemResponseType } from "../types/ProblemListType";
import { useToast } from "@/hooks";
import { showToastError, showToastSuccess } from "@/utils";

export const useGetAdminProblemList = (params: AdminProblemParams) =>
  useQuery({
    queryKey: ["problemList", params],
    queryFn: async () => {
      return await adminProblemAPI.getAdminProblemList(params);
    },
    refetchOnWindowFocus: false,
    retry: false,
    placeholderData: (previous) => previous
  });

export const usePutProblemPublication = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["problemPublication"],
    mutationFn: async ({ problemId, isPublished }: { problemId: string; isPublished: boolean }) => {
      return await adminProblemAPI.updateProblemPublicationStatus(problemId, isPublished);
    },
    onSuccess: (_, { problemId, isPublished }) => {
      showToastSuccess({ toast, message: `Problem ${isPublished ? "published" : "unpublished"} successfully!` });

      // Update the cache directly instead of invalidating
      queryClient.setQueriesData(
        { queryKey: ["problemList"], exact: false },
        (oldData: GetAdminProblemResponseType) => {
          if (!oldData || !oldData.result || !oldData.result.content) return oldData;

          // Create a new array with the updated problem
          const updatedContent = oldData.result.content.map((problem: GetAdminProblem) => {
            if (problem.problemId === problemId) {
              return {
                ...problem,
                isPublished
              };
            }
            return problem;
          });

          return {
            ...oldData,
            result: {
              ...oldData.result,
              content: updatedContent
            }
          };
        }
      );
    },
    onError: () => {
      showToastError({ toast, message: "Update problem publication status failed" });
    }
  });
};

export const useDeleteProblem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["problemDelete"],
    mutationFn: async (problemId: string) => {
      if (!problemId) {
        throw new Error("Problem ID is required for deletion");
      }
      return await adminProblemAPI.deleteProblem(problemId);
    },
    onSuccess: () => {
      showToastSuccess({ toast, message: "Problem deleted successfully!" });
      queryClient.invalidateQueries({
        queryKey: ["problemList"]
      });
    },
    onError: () => {
      showToastError({ toast, message: "Couldn't delete the selected problem" });
    }
  });
};
