import { TLeaderboardRank, TSort, IPageable } from "@/types";

type TGetLeaderboardResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: TLeaderboardRank[];
  number: number;
  sort: TSort;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type { TGetLeaderboardResponse };
