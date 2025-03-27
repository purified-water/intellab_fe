import { useEffect, useState } from "react";
import { PaymentBlock } from "../components";
import { TIntellabPayment } from "../types";
import { useSearchParams } from "react-router-dom";
import { paymentAPI, authAPI, userAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import { setPremiumStatus } from "@/redux/premiumStatus/premiumStatusSlice";
import { VNPAY_TRANSACTION_CODE, PAYMENT_FOR } from "../constants";
import { RootState } from "@/redux/rootReducer";

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const toast = useToast();

  const [payment, setPayment] = useState<TIntellabPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userRedux = useSelector((state: RootState) => state.user.user);

  const getProfileMeAPI = async () => {
    await userAPI.getProfileMe({
      onSuccess: async (user) => {
        dispatch(setUser(user));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const getPremiumStatusAPI = async (uid: string) => {
    await authAPI.getPremiumStatus({
      query: { uid },
      onSuccess: async (data) => {
        dispatch(setPremiumStatus(data));
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message })
    });
  };

  const getPaymentAPI = async () => {
    if (paymentId) {
      await paymentAPI.getIntellabPayment({
        query: {
          paymentId
        },
        onStart: async () => setLoading(true),
        onSuccess: async (result) => {
          setPayment(result);
          // Can't increate courseCount or update premium status with redux when making payment
          // Since after payment, the user will be redirected to this page
          // So we need to call getProfileMeAPI to update courseCount
          if (result.userUid === userRedux?.userId && result.transactionStatus === VNPAY_TRANSACTION_CODE.SUCCESS) {
            if (result.paymentFor == PAYMENT_FOR.COURSE) {
              await getProfileMeAPI();
            } else if (result.paymentFor == PAYMENT_FOR.SUBCRIPTION) {
              await getPremiumStatusAPI(result.userUid);
            }
          }
        },
        onFail: async (message) => showToastError({ toast: toast.toast, message }),
        onEnd: async () => setLoading(false)
      });
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
