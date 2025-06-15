import { adminJudgeAPI } from "@/features/Admins/api";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useGetJudgeServices = () =>
  useQuery({
    queryKey: ["getJudgePods"],
    queryFn: () => adminJudgeAPI.getJudgePods(),
    refetchOnWindowFocus: true,
    staleTime: 60000 // Data is fresh for 1 minute
  });

export const usePostJudgeScale = () =>
  useMutation({
    mutationFn: (replicas: number) => adminJudgeAPI.postJudgeScale(replicas),
    onSuccess: () => {
      useGetJudgeServices().refetch();
    }
  });
