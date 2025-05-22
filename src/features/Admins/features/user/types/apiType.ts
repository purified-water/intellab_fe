import { TApiResponse, TSort, IPageable, TGetApiParams, IUser } from "@/types";

type TGetUsersForAdminResponse = TApiResponse<{
  totalPages: number;
  totalElements: number;
  size: number;
  content: IUser[];
  number: number;
  sort: TSort;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}>;

type TGetUsersForAdminParams = TGetApiParams<
  {
    keyword: string;
    page: number;
  },
  {
    totalPages: number;
    totalElements: number;
    size: number;
    content: IUser[];
    number: number;
    sort: TSort;
    pageable: IPageable;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
  }
>;

export type { TGetUsersForAdminResponse, TGetUsersForAdminParams };
