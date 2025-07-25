import { userAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetBadges = (userId: string, isPublic: boolean = true) => {
  return useQuery({
    queryKey: ["badges", userId, isPublic],
    queryFn: async () => {
      const response = await userAPI.getProfileBadges(userId);
      return response.result;
    },
    refetchOnWindowFocus: true,
    enabled: !!userId && isPublic
  });
};
