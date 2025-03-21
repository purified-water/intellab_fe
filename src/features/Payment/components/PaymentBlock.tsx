import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { CircleCheck, CircleX } from "lucide-react";
import { InformationRow } from "./InformationRow";
import { TIntellabPayment } from "../types";
import { shortenDate } from "@/utils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { VNPAY_TRANSACTION_CODE } from "../constants";

type PaymentBlockProps = {
  payment: TIntellabPayment | null;
  loading: boolean;
};

export function PaymentBlock(props: PaymentBlockProps) {
  const { payment, loading } = props;

  const navigate = useNavigate();

  const onBackHomeClick = () => {
    navigate("/");
  };

  const success = payment?.transactionStatus === VNPAY_TRANSACTION_CODE.SUCCESS;

  const renderContent = () => {
    const renderStatus = () => {
      let icon = null;
      let title = null;
      let color = null;

      if (success) {
        title = "Payment Successfully!";
        color = "appEasy";
        icon = <CircleCheck size={80} className="text-appEasy" />;
      } else {
        title = "Payment Failed!";
        color = "appHard";
        icon = <CircleX size={80} className="text-appHard" />;
      }

      return (
        <div className="space-y-4 justify-items-center">
          {icon}
          <p className={`text-${color} font-bold text-2xl`}>{title}</p>
        </div>
      );
    };

    const renderInformation = () => {
      return (
        <div className="w-full space-y-2 mt-10">
          <InformationRow label="Payment Status" value={payment!.transactionStatusDescription} />
          <InformationRow label="Order ID" value={payment!.paymentId} />
          <InformationRow label="Order information" value={payment!.transactionReference} />
          <InformationRow
            label="Payment Amount"
            value={`${payment?.totalPaymentAmount.toLocaleString()} ${payment?.currency}`}
          />
          <InformationRow label="Created at" value={shortenDate(payment!.createdAt)} />
          {payment?.receivedAt && <InformationRow label="Received at" value={shortenDate(payment?.receivedAt)} />}
        </div>
      );
    };

    const renderBackButton = () => {
      return (
        <Button className="mt-16 font-bold bg-appPrimary hover:bg-appPrimary/80" onClick={onBackHomeClick}>
          Back to Home Page
        </Button>
      );
    };

    return (
      <>
        {renderStatus()}
        <p className="mt-4 text-lg font-semibold">PAYMENT DETAIL</p>
        {renderInformation()}
        {renderBackButton()}
      </>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="w-20 h-20 mx-auto" />
        <Skeleton className="w-3/4 h-8 mx-auto" />
        <Skeleton className="w-1/2 h-6 mx-auto" />
        <div className="w-full mt-10 space-y-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
        </div>
        <Skeleton className="w-1/2 h-12 mx-auto mt-16" />
      </div>
    );
  };

  return (
    <div className="bg-white px-10 py-8 justify-items-center w-[500px] text-gray2 rounded-md shadow-md">
      {loading ? renderSkeleton() : renderContent()}
    </div>
  );
}
