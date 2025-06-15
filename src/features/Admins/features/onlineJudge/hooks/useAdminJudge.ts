import { adminJudgeAPI } from "@/features/Admins/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetJudgeServices = () =>
  useQuery({
    queryKey: ["getJudgePods"],
    queryFn: () => adminJudgeAPI.getJudgePods(),
    refetchOnWindowFocus: true,
    staleTime: 60000 // Data is fresh for 1 minute
  });

export const usePostJudgeScale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replicas: number) => adminJudgeAPI.postJudgeScale(replicas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getJudgePods"] });
    }
  });
};
