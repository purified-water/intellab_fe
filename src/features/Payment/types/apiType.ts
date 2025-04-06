import { TApiResponse, TSort, IPageable, TPostApiParams, TGetApiParams } from "@/types";
import { TVnpayPayment, TIntellabPayment } from "./payment";

type TRefundResponse = TApiResponse<TVnpayPayment>;

type TCreateCoursePaymentResponse = TApiResponse<TIntellabPayment>;

type TGetVNPayPaymentResponse = TApiResponse<TVnpayPayment>;

type TGetIntellabPaymentResponse = TApiResponse<TIntellabPayment>;

type TGetPaymentMeResponse = TApiResponse<{
  totalPages: number;
  totalElements: number;
  size: number;
  content: TIntellabPayment[];
  number: number;
  sort: TSort;
  pageable: IPageable;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}>;

type TCreatePremiumPaymentResponse = TApiResponse<TIntellabPayment>;

type TGetIntellabPaymentParams = TGetApiParams<
  {
    paymentId: string;
  },
  TIntellabPayment
>;

type TCreatePremiumPaymentParams = TPostApiParams<
  undefined,
  {
    premiumPackage: string;
    premiumDuration: string;
    isChangePlan: boolean;
  },
  TIntellabPayment
>;

export type {
  TRefundResponse,
  TCreateCoursePaymentResponse,
  TGetVNPayPaymentResponse,
  TGetIntellabPaymentResponse,
  TGetPaymentMeResponse,
  TCreatePremiumPaymentResponse,
  TGetIntellabPaymentParams,
  TCreatePremiumPaymentParams
};
