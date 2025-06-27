import { userAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetBadges = () => {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const response = await userAPI.getProfileBadges();
      return response.result;
    }
  });
};
