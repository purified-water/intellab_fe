import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { setLoginStreak } from "@/redux/user/userSlice";
import { usePostLoginStreak } from "@/features/StudentOverall/hooks/useHomePage";
import { shouldFetchLoginStreak } from "@/utils/loginStreakUtils";
import { LoginStreak } from "@/features/StudentOverall/types";

export const useLoginStreakWithCache = (forceRefresh: boolean = false) => {
  const dispatch = useDispatch();
  const { loginStreak, loginStreakLastFetched } = useSelector((state: RootState) => state.user);
  const { mutate: postLoginStreak, isPending: isLoadingLoginStreak } = usePostLoginStreak();

  const fetchLoginStreak = () => {
    postLoginStreak(undefined, {
      onSuccess: (loginStreakResponse: LoginStreak) => {
        dispatch(setLoginStreak(loginStreakResponse.streakLogin));
      },
      onError: (error) => {
        console.error("Failed to fetch login streak:", error);
        dispatch(setLoginStreak(0));
      }
    });
  };

  useEffect(() => {
    // Only fetch if data is stale or doesn't exist
    if (shouldFetchLoginStreak(loginStreakLastFetched, forceRefresh)) {
      fetchLoginStreak();
    }
  }, [loginStreakLastFetched, forceRefresh]);

  return {
    loginStreak,
    isLoadingLoginStreak,
    refetch: fetchLoginStreak,
    lastFetched: loginStreakLastFetched
  };
};
