import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { CircleCheck, CircleX } from "lucide-react";
import { InformationRow } from "./InformationRow";
import { TCourseFromPayment, TIntellabPayment } from "../../types";
import { shortenDate, showToastError } from "@/utils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { PAYMENT_FOR, VNPAY_TRANSACTION_CODE } from "../../constants";
import { paymentAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type PaymentBlockProps = {
  payment: TIntellabPayment | null;
  loading: boolean;
};

export function PaymentBlock(props: PaymentBlockProps) {
  const { payment, loading } = props;

  const [courseFromPayment, setCourseFromPayment] = useState<TCourseFromPayment | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const success = payment?.transactionStatus === VNPAY_TRANSACTION_CODE.SUCCESS;

  const getCourseFromPaymentAPI = async (paymentId: string) => {
    await paymentAPI.getCourseFromPayment({
      query: { paymentId },
      onStart: async () => setInternalLoading(true),
      onSuccess: async (data) => setCourseFromPayment(data),
      onFail: async (message) => showToastError({ toast: toast.toast, message }),
      onEnd: async () => setInternalLoading(false)
    });
  };

  useEffect(() => {
    if (success && payment?.paymentFor === PAYMENT_FOR.COURSE) {
      getCourseFromPaymentAPI(payment.paymentId);
    }
  }, [payment]);

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
        <div className="w-full mt-10 space-y-2">
          <InformationRow label="Payment Status" value={payment!.transactionStatusDescription} />
          <InformationRow label="Order ID" value={payment!.paymentId} />
          <InformationRow label="Order information" value={payment!.orderDescription} />
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
      const handleBackButtonClick = () => {
        navigate("/");
      };

      return (
        <Button className="font-bold bg-appPrimary hover:bg-appPrimary/80" onClick={handleBackButtonClick}>
          Back to Home Page
        </Button>
      );
    };

    const renderGoToCourseButton = () => {
      const handleGoToCourseClick = () => {
        navigate(`/course/${courseFromPayment?.courseId}`);
      };

      return (
        <Button className="font-bold bg-appPrimary hover:bg-appPrimary/80" onClick={handleGoToCourseClick}>
          Start Learning now!
        </Button>
      );
    };

    return (
      <>
        {renderStatus()}
        <p className="mt-4 text-lg font-semibold">PAYMENT DETAIL</p>
        {renderInformation()}
        <div className="space-x-4 mt-16">
          {renderBackButton()}
          {courseFromPayment && renderGoToCourseButton()}
        </div>
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
      {loading || internalLoading ? renderSkeleton() : renderContent()}
    </div>
  );
}
