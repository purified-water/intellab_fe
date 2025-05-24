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

export type { TApiParams, TApiResponse, TGetApiParams, TPostApiParams };
