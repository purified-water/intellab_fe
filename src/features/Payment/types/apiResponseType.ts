import { TApiResponse, TSort, IPageable } from "@/types";
import { TVnpayPayment, TIntellabPayment } from "./payment";

type TRefundResponse = TApiResponse<TVnpayPayment>;

type TCreateCoursePaymentResponse = TApiResponse<TIntellabPayment>;

type TGetVNPayPaymentResponse = TApiResponse<TVnpayPayment>;

type TGetIntellabPaymentResponse = TApiResponse<TIntellabPayment>;

type TGetPaymenMe = TApiResponse<{
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

export type {
  TRefundResponse,
  TCreateCoursePaymentResponse,
  TGetVNPayPaymentResponse,
  TGetIntellabPaymentResponse,
  TGetPaymenMe
};
