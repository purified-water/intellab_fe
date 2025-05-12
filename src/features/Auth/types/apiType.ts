import { TApiResponse, TPostApiParams } from "@/types";

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

type TUpdatePasswordResponse = TApiResponse<boolean>;

type TUpdatePasswordParams = TPostApiParams<
  undefined,
  {
    token: string;
    newPassword: string;
  },
  boolean
>;

export type {
  TResetPasswordResponse,
  TResetPasswordParams,
  TResentVerificationEmailResponse,
  TResentVerificationEmailParams,
  TUpdatePasswordResponse,
  TUpdatePasswordParams
};
