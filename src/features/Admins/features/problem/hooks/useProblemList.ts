import { useQuery } from "@tanstack/react-query";
import { adminProblemAPI } from "@/features/Admins/api";
import { AdminProblemParams } from "../types/ProblemListType";

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
