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

export type { TApiParams, TApiResponse, TGetApiParams, TPostApiParams };
