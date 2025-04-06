import { TLeaderboardRank, TGetApiParams, TSort, IPageable } from "@/types";

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

type TGetLeaderboardParams = TGetApiParams<
  {
    filter?: string;
    page?: number;
    size?: number;
  },
  TGetLeaderboardResponse
>;

export type { TGetLeaderboardResponse, TGetLeaderboardParams };
