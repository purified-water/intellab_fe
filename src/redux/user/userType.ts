import { IUser } from "@/types";

export interface UserState {
  user: IUser | null;
  point: number | null;
  loginStreak: number | null;
  loginStreakLastFetched: string | null; // ISO string timestamp
}
