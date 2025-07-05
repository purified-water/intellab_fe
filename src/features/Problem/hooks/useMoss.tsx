import { mossAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { MOSSResult } from "../types";

export const useGetMossResult = (submissionId: string, isAllCorrect: boolean) => {
  return useQuery({
    queryKey: ["mossResult", submissionId],
    queryFn: async (): Promise<MOSSResult[]> => {
      const response = await mossAPI.getMossResult(submissionId);
      return response;
    },
    enabled: !!submissionId && isAllCorrect
  });
};
