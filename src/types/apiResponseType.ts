type TApiResponse<T> = {
  code: number;
  message: string | null;
  result: T;
};

export type { TApiResponse };
