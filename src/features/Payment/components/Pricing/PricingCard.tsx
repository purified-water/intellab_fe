import { Button } from "@/components/ui";
import { PREMIUM_DURATION, PREMIUM_STATUS } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { paymentAPI } from "@/lib/api";
import { RootState } from "@/redux/rootReducer";
import { showToastError } from "@/utils";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useSelector } from "react-redux";
import { PriceDisplay } from "./PriceDisplay";

interface Plan {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  priceUnit: string;
  isHighlighted: boolean;
  isPopular: boolean;
  requestPackage: string;
  responsePackage: string;
  duration: (typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION];
}

const usePayment = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const userRedux = useSelector((state: RootState) => state.user.user);
  const toast = useToast();

  const createPremiumPayment = async (requestPackage: string, duration: string, isChangePlan: boolean) => {
    await paymentAPI.createPremiumPayment({
      body: {
        premiumPackage: requestPackage,
        premiumDuration: duration,
        isChangePlan
      },
      onSuccess: async (data) => {
        window.location.href = data.paymentUrl!;
        return Promise.resolve();
      },
      onFail: async (error) => {
        showToastError({ toast: toast.toast, message: error });
      }
    });
  };

  const handlePurchaseClick = async (requestPackage: string, duration: string) => {
    if (!isAuthenticated) {
      showToastError({ toast: toast.toast, message: "Please login to purchase plan" });
      return;
    }

    if (!userRedux?.isEmailVerified) {
      showToastError({
        toast: toast.toast,
        title: "Email verification required",
        message: (
          <>
            Please go to the{" "}
            <a href="/profile/edit" className="underline text-appHyperlink">
              Setting Page
            </a>{" "}
            and verify your email to purchase plan.
          </>
        )
      });
      return;
    }

    const isCurrenPlanActive = reduxPremiumStatus?.status === PREMIUM_STATUS.ACTIVE;
    await createPremiumPayment(requestPackage, duration, isCurrenPlanActive);
  };

  return { handlePurchaseClick, isAuthenticated, reduxPremiumStatus, userRedux };
};

export const PricingCard = ({ plan }: { plan: Plan }) => {
  const { handlePurchaseClick, reduxPremiumStatus } = usePayment();

  const isCurrentPlan =
    reduxPremiumStatus?.planType === plan.requestPackage && reduxPremiumStatus?.durationEnums === plan.duration;

  const cardStyles = plan.isHighlighted
    ? "bg-gradient-to-tr from-appPrimary/5 to-fuchsia-300/40 rounded-[10px] shadow-[0px_0px_8px_5px_rgba(247,208,250,0.26)] outline outline-[0.50px] outline-offset-[-0.50px] outline-appPrimary"
    : "bg-zinc-100 rounded-[10px]";

  const renderPurchaseButton = () => {
    const handleClick = async () => {
      await handlePurchaseClick(plan.requestPackage, plan.duration);
    };

    if (isCurrentPlan) {
      return (
        // <div className="w-full h-[45px] font-bold text-white text-base bg-gray-400 rounded-[10px] flex items-center justify-center">
        //   Current Plan
        // </div>
        <button
          type="button"
          className="self-stretch px-12 py-2.5 bg-gray-400 rounded-lg inline-flex justify-center items-center gap-2.5 mt-4"
        >
          <div className="justify-center w-40 h-5 text-sm font-semibold text-center text-white">Current Plan</div>
        </button>
      );
    }

    return (
      <Button
        onClick={handleClick}
        className="flex items-center self-stretch justify-center font-semibold text-center text-white px-12 py-2.5 bg-appPrimary rounded-lg mt-4"
      >
        Subscribe
      </Button>
    );
  };

  return (
    <>
      <motion.div
        className={`px-10 py-7 ${cardStyles} inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden`}
        whileHover={{ scale: 1.03 }}
      >
        <div
          className={`${plan.isHighlighted ? "pb-12" : "pb-5"} flex w-full flex-col justify-start items-start gap-2.5`}
        >
          <div
            className={`w-full h-7 inline-flex justify-between text-sm items-end ${plan.isHighlighted ? "gap-[5px]" : ""}`}
          >
            <div className="flex items-end justify-start gap-3">
              <div className="text-2xl font-semibold text-black">{plan.title}</div>
              <div className="font-medium text-gray2">{plan.subtitle}</div>
            </div>
            {plan.isPopular && (
              <div className="flex items-center font-medium text-appPrimary">
                <Sparkle className="inline-block w-4 h-4 mr-1" />
                Most popular
              </div>
            )}
          </div>
          <div className="justify-start w-96">
            <div className="text-sm font-normal text-gray3">{plan.description}</div>
          </div>
        </div>
        <div className="self-stretch py-[5px] inline-flex justify-between items-end">
          <div className="flex flex-col justify-start">
            <PriceDisplay planId={plan.id} price={plan.price} priceUnit={plan.priceUnit} />
          </div>
          <div className="justify-start text-gray2 text-[10px] font-light">Prices are maked in Vietnamese Dong</div>
        </div>
        {renderPurchaseButton()}
      </motion.div>
    </>
  );
};
