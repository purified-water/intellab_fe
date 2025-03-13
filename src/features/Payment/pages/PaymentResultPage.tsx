import { useEffect, useState } from "react";
import { PaymentBlock } from "../components";
import { TIntellabPayment } from "../types";
import { useSearchParams } from "react-router-dom";
import { paymentAPI } from "@/lib/api";
import { API_RESPONSE_CODE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const toast = useToast();

  const [payment, setPayment] = useState<TIntellabPayment | null>(null);
  const [loading, setLoading] = useState(true);

  const getPaymentAPI = async () => {
    if (paymentId) {
      try {
        const response = await paymentAPI.getIntellabPayment(paymentId);
        const { code, message, result } = response;
        if (code == API_RESPONSE_CODE.SUCCESS && result) {
          setPayment(result);
        } else {
          showToastError({ toast: toast.toast, message: message ?? "Error getting payment" });
        }
      } catch (e) {
        showToastError({ toast: toast.toast, message: e.message ?? "Error gettingpayment" });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      showToastError({ toast: toast.toast, message: "Payment ID not found" });
    }
  };

  useEffect(() => {
    getPaymentAPI();
  }, [paymentId]);

  return (
    <div className="flex justify-center h-screen bg-gray5 pt-20">
      <div>
        <PaymentBlock payment={payment} loading={loading} />
      </div>
    </div>
  );
}
