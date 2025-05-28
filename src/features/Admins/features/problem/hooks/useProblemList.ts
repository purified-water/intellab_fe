import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProblemAPI } from "@/features/Admins/api";
import { AdminProblemParams } from "../types/ProblemListType";
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
    onSuccess: (_, { isPublished }) => {
      showToastSuccess({ toast, message: `Problem ${isPublished ? "published" : "unpublished"} successfully!` });
      queryClient.invalidateQueries({
        queryKey: ["problemList"]
      });
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
