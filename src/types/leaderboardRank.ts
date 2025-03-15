type TLeaderboardRank = {
  point: number;
  displayName: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  userUid: string;
  // There are two more field "courseStat" and "courseStat" but we don't need them on the UI or functionality
};

export type { TLeaderboardRank };
