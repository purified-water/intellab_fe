type TApiResponse<T> = {
  code: number;
  message: string | null;
  result: T;
};

type TApiParams<Data> = {
  onStart?: () => Promise<void>;
  onSuccess: (data: Data) => Promise<void>;
  onFail: (message: string) => Promise<void>;
  onEnd?: () => Promise<void>;
};

type TGetApiParams<Querry, Data> = TApiParams<Data> & {
  query?: Querry;
};

type TPostApiParams<Querry, Body, Data> = TGetApiParams<Querry, Data> & {
  body?: Body;
};

type APIResponseCode = {
  code: number;
  message: string;
};

type APIMetaData = {
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};
export type { TApiParams, TApiResponse, TGetApiParams, TPostApiParams, APIResponseCode, APIMetaData };
