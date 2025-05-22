import { useQuery } from "@tanstack/react-query";
import { courseAPI, leaderboardAPI, userAPI } from "@/lib/api";
import { ICourse } from "@/types";
import { IUserCourse } from "../types";
import { TGetLeaderboardParamsTanstack } from "@/features/Leaderboard/types/apiType";

export const useGetFeaturedCourses = () => {
  return useQuery<ICourse[]>({
    queryKey: ["featuredCourses"],
    queryFn: async () => {
      const response = await courseAPI.getCourses();
      return response.result.content;
    },
    enabled: true
  });
};

export const useGetYourCourses = () => {
  return useQuery({
    queryKey: ["yourCourses"],
    queryFn: async () => {
      const response = await courseAPI.getUserEnrolledCourses();
      return response.result.content as IUserCourse[];
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
    placeholderData: (previous) => previous
  });
};
