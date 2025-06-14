import { IUser } from "@/types";

export interface UserState {
  user: IUser | null;
  point: number | null;
}
