/**
 * Check if login streak data is stale and needs to be refetched
 * Login streak should be fetched once per day
 */
export const isLoginStreakStale = (lastFetched: string | null): boolean => {
  if (!lastFetched) return true;

  const lastFetchedDate = new Date(lastFetched);
  const now = new Date();

  // Check if it's a different day
  return (
    lastFetchedDate.getDate() !== now.getDate() ||
    lastFetchedDate.getMonth() !== now.getMonth() ||
    lastFetchedDate.getFullYear() !== now.getFullYear()
  );
};

/**
 * Check if login streak should be fetched based on user login
 * This can be extended to include other conditions like user login time
 */
export const shouldFetchLoginStreak = (lastFetched: string | null, forceRefresh: boolean = false): boolean => {
  if (forceRefresh) return true;
  return isLoginStreakStale(lastFetched);
};
