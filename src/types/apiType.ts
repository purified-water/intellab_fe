type TApiResponse<ResultDataType> = {
  code: number;
  message: string | null;
  result: ResultDataType;
};

type TApiParams<ResultDataType> = {
  onStart?: () => Promise<void>;
  onSuccess: (data: ResultDataType) => Promise<void>;
  onFail: (message: string) => Promise<void>;
  onEnd?: () => Promise<void>;
};

type TGetApiParams<QueryParamsType, ResultDataType> = TApiParams<ResultDataType> & {
  query?: QueryParamsType;
};

type TPostApiParams<QueryParamsType, BodyDataType, ResultDataType> = TGetApiParams<QueryParamsType, ResultDataType> & {
  body?: BodyDataType;
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
