import { userAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetBadges = (userId: string) => {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const response = await userAPI.getProfileBadges(userId);
      return response.result;
    },
    enabled: !!userId
  });
};
