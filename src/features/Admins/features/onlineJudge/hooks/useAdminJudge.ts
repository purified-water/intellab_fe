import { adminJudgeAPI } from "@/features/Admins/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetJudgeServices = () =>
  useQuery({
    queryKey: ["getJudgePods"],
    queryFn: () => adminJudgeAPI.getJudgePods(),
    refetchOnWindowFocus: true,
    staleTime: 10000,
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData
  });

export const useGetPendingSubmissions = () =>
  useQuery({
    queryKey: ["getPendingSubmissions"],
    queryFn: () => adminJudgeAPI.getPendingSubmissions(),
    refetchOnWindowFocus: true,
    staleTime: 10000,
    refetchInterval: 10000,
    placeholderData: (previousData) => previousData
  });

export const usePostJudgeScale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replicas: number) => adminJudgeAPI.postJudgeScale(replicas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getJudgePods"] });
      queryClient.invalidateQueries({ queryKey: ["getPendingSubmissions"] });
    }
  });
};
