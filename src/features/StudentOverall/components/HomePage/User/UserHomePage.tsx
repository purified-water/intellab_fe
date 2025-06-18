import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { StatsCards } from "./StatsCard";
import { YourCourses } from "./YourCourses";
import { UserOverview } from "./UserOverview";
import { Leaderboard } from "./Leaderboard";
import { UserFeaturedCourses } from "./UserFeaturedCourses";
import {
  useGetFeaturedCourses,
  useGetFreeCourses,
  useGetLeaderboard,
  useGetProgressLevel,
  useGetYourCourses
} from "@/features/StudentOverall/hooks/useHomePage";
import { getUserIdFromLocalStorage } from "@/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useLoginStreakWithCache } from "@/hooks";

export const UserHomePage = () => {
  const userId = getUserIdFromLocalStorage();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: (() => {
      const to = new Date();
      to.setDate(to.getDate() + 7);
      return to;
    })()
  });
  const leaderboardQueryParams = useMemo(() => ({ filter: "all", page: 0, size: 5 }), []);

  // Hooks
  const { data: yourCourseList, isPending: isFetchingYourCourses } = useGetYourCourses();
  const { data: featuredCourses, isPending: isFetchingFeaturedCourses } = useGetFeaturedCourses();
  const { data: freeCourses, isPending: isFetchingFreeCourses } = useGetFreeCourses();
  const { data: progressLevel, isPending: isFetchingProgressLevel } = useGetProgressLevel(userId || "");
  const { data: leaderboardDataRaw, isPending: isFetchingLeaderboard } = useGetLeaderboard(leaderboardQueryParams);
  const { loginStreak, isLoadingLoginStreak } = useLoginStreakWithCache();
  const leaderboardData = leaderboardDataRaw?.slice(0, 5) || [];
  const userRedux = useSelector((state: RootState) => state.user.user);

  return (
    <main className="flex-1">
      <div className="container flex-1 p-4 pt-6 md:px-32">
        <div className="flex flex-col items-start justify-between mb-8 space-y-2 md:flex-row md:items-center md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight text-transparent bg-gradient-to-tr from-appPrimary to-appSecondary bg-clip-text">
            Welcome back, {userRedux?.displayName}!
          </h2>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange setDate={setDateRange} date={dateRange} />
          </div>
        </div>
        <StatsCards loginStreak={loginStreak} isLoadingLoginStreak={isLoadingLoginStreak} />

        <div className="grid gap-4 mt-8 mb-24 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
          <YourCourses
            className="col-span-full md:col-span-4 lg:col-span-5 xl:col-span-8"
            userEnrollCourses={yourCourseList || []}
            isLoading={isFetchingYourCourses}
          />
          <div className="space-y-4 col-span-full md:col-span-2 lg:col-span-3 xl:col-span-4">
            <UserOverview progress={progressLevel || null} isLoading={isFetchingProgressLevel} />
            <Leaderboard leaderboardData={leaderboardData} isLoading={isFetchingLeaderboard} />
          </div>
        </div>

        <UserFeaturedCourses courses={featuredCourses || []} className="mb-24" isLoading={isFetchingFeaturedCourses} />
        <UserFeaturedCourses courses={freeCourses || []} isLoading={isFetchingFreeCourses} type="free" />
      </div>
    </main>
  );
};
