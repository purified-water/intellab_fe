import { TPostApiParams } from "@/types";

type TResetPasswordResponse = boolean;

type TResetPasswordParams = TPostApiParams<
  undefined,
  {
    email: string;
  },
  TResetPasswordResponse
>;

export type { TResetPasswordResponse, TResetPasswordParams };
