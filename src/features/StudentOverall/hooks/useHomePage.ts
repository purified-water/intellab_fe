import { useMutation, useQuery } from "@tanstack/react-query";
import { courseAPI, leaderboardAPI, userAPI } from "@/lib/api";
import { ICourse } from "@/types";
import { TGetLeaderboardParamsTanstack } from "@/features/Leaderboard/types/apiType";

export const useGetFeaturedCourses = () => {
  return useQuery<ICourse[]>({
    queryKey: ["featuredCourses"],
    queryFn: async () => {
      const response = await courseAPI.getFeaturedCourses();
      return response.result;
    },
    staleTime: 1000 * 60 * 60,
    placeholderData: (previous) => previous
  });
};

export const useGetFreeCourses = () => {
  return useQuery<ICourse[]>({
    queryKey: ["freeCourses"],
    queryFn: async () => {
      const response = await courseAPI.getFreeCourses();
      return response.result.content;
    },
    staleTime: 1000 * 60 * 60,
    placeholderData: (previous) => previous
  });
};

export const useGetYourCourses = () => {
  return useQuery({
    queryKey: ["yourCourses"],
    queryFn: async () => {
      const response = await courseAPI.getUserEnrolledCourses();
      return response.result.content as ICourse[];
    },
    placeholderData: (previous) => previous
  });
};

export const useGetEnrolledCourseDetail = (courseId: string) => {
  return useQuery({
    queryKey: ["enrolledCourseDetail", courseId],
    queryFn: async () => {
      const response = await courseAPI.getCourseDetail(courseId);
      return response.result;
    },
    enabled: !!courseId
  });
};

// Get progress level
export const useGetProgressLevel = (userId: string) => {
  return useQuery({
    queryKey: ["progressLevel", userId],
    queryFn: async () => {
      const response = await userAPI.getProgressLevel(userId);
      return response;
    },
    enabled: !!userId
  });
};

// Get leaderboard for home page
export const useGetLeaderboard = (query: TGetLeaderboardParamsTanstack) => {
  return useQuery({
    queryKey: ["leaderboard", query],
    queryFn: async () => {
      const response = await leaderboardAPI.getLeaderboardTanstack(query);
      return response.content;
    },
    placeholderData: (previous) => previous,
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    gcTime: 1000 * 60 * 10 // Garbage collect after 10 minutes
  });
};

export const usePostLoginStreak = () => {
  return useMutation({
    mutationKey: ["loginStreak"],
    mutationFn: async () => {
      const response = await userAPI.postLoginStreak();
      return response.result;
    }
  });
};
