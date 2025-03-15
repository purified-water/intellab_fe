type TLeaderboardRank = {
  point: number;
  displayName: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  userUid: string;
  courseStat: {
    beginner: number;
    intermediate: number;
    advanced: number;
    total: number;
  };
  problemStat: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
};

export type { TLeaderboardRank };
