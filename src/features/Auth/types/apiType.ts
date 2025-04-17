import { TPostApiParams } from "@/types";

type TResetPasswordResponse = boolean;

type TResetPasswordParams = TPostApiParams<
  undefined,
  {
    email: string;
  },
  TResetPasswordResponse
>;

type TResentVerificationEmailResponse = boolean;

type TResentVerificationEmailParams = TPostApiParams<
  undefined,
  {
    email: string;
  },
  TResentVerificationEmailResponse
>;

export type {
  TResetPasswordResponse,
  TResetPasswordParams,
  TResentVerificationEmailResponse,
  TResentVerificationEmailParams
};
