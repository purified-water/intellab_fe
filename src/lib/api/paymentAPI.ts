import { apiClient } from "./apiClient";
import {
  TRefundResponse,
  TCreateCoursePaymentResponse,
  TGetVNPayPaymentResponse,
  TGetIntellabPaymentResponse,
  TGetPaymenMe
} from "@/features/Payment/types";

const DEFAULT_PAGE_SIZE = 10;

export const paymentAPI = {
  refund: async (paymentId: string) => {
    const queryParams = {
      paymentId
    };
    const response = await apiClient.post("identity/payment/vnpay/refund", null, { params: queryParams });
    const data: TRefundResponse = response.data;
    return data;
  },

  createCoursePayment: async (courseId: string) => {
    const bodyData = {
      language: "VIETNAMESE",
      courseId,
      vnpayBankCode: "VNBANK",
      vnpayCurrencyCode: "VND"
    };
    const response = await apiClient.post("identity/payment/vnpay/checkout/single-course", bodyData);
    const data: TCreateCoursePaymentResponse = response.data;
    return data;
  },

  getVNPayPayment: async (paymentId: string) => {
    const response = await apiClient.get(`identity/payment/vnpay/get-vnpay-payment/${paymentId}`);
    const data: TGetVNPayPaymentResponse = response.data;
    return data;
  },

  getIntellabPayment: async (paymentId: string) => {
    const response = await apiClient.get(`identity/payment/vnpay/get-payment/${paymentId}`);
    const data: TGetIntellabPaymentResponse = response.data;
    return data;
  },

  getPaymentMe: async (page: number, size?: number, sort?: string) => {
    const queryParams = {
      page,
      size: size ?? DEFAULT_PAGE_SIZE,
      sort: sort ?? ""
    };
    const response = await apiClient.get("identity/payment/vnpay/get-payments/me", { params: queryParams });
    const data: TGetPaymenMe = response.data;
    return data;
  }
};
