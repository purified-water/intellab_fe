import { apiClient } from "./apiClient";
import {
  TRefundResponse,
  TCreateCoursePaymentResponse,
  TGetVNPayPaymentResponse,
  TGetIntellabPaymentResponse,
  TGetPaymentMeResponse,
  TCreatePremiumPaymentResponse,
  TGetIntellabPaymentParams,
  TCreatePremiumPaymentParams
} from "@/features/Payment/types";
import { API_RESPONSE_CODE } from "@/constants";
import { LANGUAGE, VNPAY_BANK_CODE, VNPAY_CURRENCY_CODE } from "@/features/Payment/constants";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_LANGUAGE = LANGUAGE.VIETNAMESE;
const DEFAULT_CURRENCY = VNPAY_CURRENCY_CODE.VND;
const DEFAULT_BANK_CODE = VNPAY_BANK_CODE.VNBANK;

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
      language: DEFAULT_LANGUAGE,
      courseId,
      vnpayBankCode: DEFAULT_BANK_CODE,
      vnpayCurrencyCode: DEFAULT_CURRENCY
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

  getIntellabPayment: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetIntellabPaymentParams) => {
    const DEFAULT_ERROR = "Error getting payment information";
    if (onStart) {
      await onStart();
    }
    try {
      const paymentId = query?.paymentId;
      const response = await apiClient.get(`identity/payment/vnpay/get-payment/${paymentId}`);
      const data: TGetIntellabPaymentResponse = response.data;
      const { code, message, result } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error) {
      await onFail(error.message ?? DEFAULT_ERROR);
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getPaymentMe: async (paymentFor: string, page: number, size?: number, sort?: string) => {
    const queryParams = {
      paymentFor: paymentFor === "SUBSCRIPTION" ? "SUBSCRIPTION" : "COURSE",
      page,
      size: size ?? DEFAULT_PAGE_SIZE,
      sort: sort ?? ""
    };
    const response = await apiClient.get("identity/payment/vnpay/get-payments/me", { params: queryParams });
    const data: TGetPaymentMeResponse = response.data;
    return data;
  },

  createPremiumPayment: async ({ body, onStart, onSuccess, onFail, onEnd }: TCreatePremiumPaymentParams) => {
    const DEFAULT_ERROR = "Error creating premium payment";

    if (onStart) {
      await onStart();
    }
    try {
      const bodyData = {
        language: DEFAULT_LANGUAGE,
        vnpayBankCode: DEFAULT_BANK_CODE,
        vnpayCurrencyCode: DEFAULT_CURRENCY,
        premiumPackage: body!.premiumPackage,
        premiumDuration: body!.premiumDuration,
        isChangePlan: body!.isChangePlan
      };
      const response = await apiClient.post("identity/payment/vnpay/checkout/premium-package", bodyData);
      const data: TCreatePremiumPaymentResponse = response.data;
      const { code, message, result } = data;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        await onSuccess(result);
      } else {
        await onFail(message ?? DEFAULT_ERROR);
      }
    } catch (error) {
      await onFail(error.message ?? DEFAULT_ERROR);
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  }
};
