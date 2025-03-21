import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaymentBlock } from "../components";
import { TIntellabPayment } from "../types";
import { useState } from "react";

const payments: TIntellabPayment[] = [
  {
    bankCode: "VCB",
    bankTransactionNo: "TXN123456789",
    createdAt: "2025-01-22T08:30:00Z",
    currency: "VND",
    paidAmount: 199000,
    paymentId: "PAY123456",
    paymentUrl: "https://payment.example.com",
    receivedAt: "2025-01-22T08:31:00Z",
    responseCode: "00",
    responseCodeDescription: "Transaction successful",
    totalPaymentAmount: 199000,
    transactionNo: "TRX987654321",
    transactionReference: "REF20250122001",
    transactionStatus: "00",
    transactionStatusDescription: "Payment completed successfully",
    userUid: "user_123",
    userUuid: "uuid-123-abc"
  },
  {
    bankCode: "TCB",
    bankTransactionNo: "TXN987654321",
    createdAt: "2025-01-22T09:00:00Z",
    currency: "VND",
    paymentId: "PAY654321",
    receivedAt: "2025-01-22T09:01:00Z",
    responseCode: "00",
    responseCodeDescription: "Transaction failed",
    totalPaymentAmount: 199000,
    transactionNo: "TRX123456789",
    transactionReference: "REF20250122002",
    transactionStatus: "01",
    transactionStatusDescription: "Insufficient funds",
    userUid: "user_456",
    userUuid: "uuid-456-def"
  }
];

export const ReceiptPage = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  return (
    <div className="container px-8 py-8 mx-auto sm:px-24">
      <h1
        className="flex items-center mb-8 text-2xl font-bold cursor-pointer hover:text-appPrimary"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1" />
        Receipt
      </h1>

      <div className="flex justify-center">
        <PaymentBlock payment={payments[0]} loading={loading} />
      </div>
    </div>
  );
};
