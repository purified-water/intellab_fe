type TVnpayPayment = {
  vnp_ResponseId: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_TxnRef: string;
  vnp_Amount: string;
  vnp_OrderInfo: string;
  vnp_ResponseCode: string;
  vnp_Message: string;
  vnp_BankCode: string;
  vnp_PayDate: string;
  vnp_TransactionNo: string;
  vnp_TransactionType: string;
  vnp_TransactionStatus: string;
  vnp_SecureHash: string;
  vnp_TransactionStatusDescription: string;
  vnp_ResponseCodeDescription: string;
};

type TIntellabPayment = {
  bankCode: string;
  bankTransactionNo: string;
  createdAt: string;
  currency: string;
  paidAmount?: number;
  paymentId: string;
  paymentUrl?: string;
  receivedAt: string;
  responseCode?: string;
  responseCodeDescription?: string;
  totalPaymentAmount: number;
  transactionNo: string;
  transactionReference: string;
  transactionStatus: string;
  transactionStatusDescription: string;
  userUid: string;
  userUuid: string;
  orderDescription: string;
  paymentFor: string;
};

type TCourseFromPayment = {
  courseId: string;
  courseName: string;
  courseDescription: string;
  level: string;
  price: number;
  unitPrice: string;
  reviewCount: number;
  averageRating: number;
  lessonCount: number;
  lessonId: string;
  lessonContent: string;
  lessonDescription: string;
  lessonOrder: number;
  lessonName: string;
  exerciseId: string;
  problemId: string;
};

type TDiscount = {
  discountPercent: number;
  discountValue: number;
};

export type { TVnpayPayment, TIntellabPayment, TCourseFromPayment, TDiscount };
