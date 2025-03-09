export const INACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 minutes

/**
 * Checks if the user has been inactive for too long and should reset chat state.
 * @returns {boolean} Whether the chat state should be cleared
 */
export const isUserInactive = (): boolean => {
  const lastVisitTimestamp = localStorage.getItem("site_last_visit");
  const currentTime = Date.now();

  if (!lastVisitTimestamp) return true; // No visit timestamp found, reset chat
  if (currentTime - parseInt(lastVisitTimestamp, 10) > INACTIVITY_THRESHOLD) return true;

  return false;
};

/**
 * Updates the last visit timestamp when the user interacts with the chat.
 */
export const updateLastVisit = (): void => {
  localStorage.setItem("site_last_visit", Date.now().toString());
};
