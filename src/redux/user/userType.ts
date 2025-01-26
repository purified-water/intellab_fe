import { UserType, Progress } from "@/types";

export interface UserState {
  user: UserType | null;
  progress: Progress | null;
}
