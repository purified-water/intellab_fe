import { AlertDialog } from "@/components/ui";
import { PREMIUM_DURATION, PREMIUM_STATUS } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { paymentAPI } from "@/lib/api";
import { RootState } from "@/redux/rootReducer";
import { showToastError } from "@/utils";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

interface Plan {
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
            <a href="/profile/edit" className="text-appHyperlink underline">
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
  const { handlePurchaseClick, isAuthenticated, reduxPremiumStatus } = usePayment();

  const isCurrentPlan =
    reduxPremiumStatus?.planType === plan.requestPackage && reduxPremiumStatus?.durationEnums === plan.duration;

  const cardStyles = plan.isHighlighted
    ? "bg-gradient-to-r from-appPrimary/5 to-fuchsia-300/25 rounded-[10px] shadow-[0px_0px_8px_5px_rgba(247,208,250,0.26)] outline outline-[0.50px] outline-offset-[-0.50px] outline-appPrimary"
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
        <button className="self-stretch px-12 py-2.5 bg-gray-400 rounded-[10px] inline-flex justify-center items-center gap-2.5 mt-4">
          <div className="w-40 h-5 text-center justify-center text-white text-sm font-semibold">Current Plan</div>
        </button>
      );
    }

    return (
      <div className="self-stretch px-12 py-2.5 bg-appPrimary rounded-[10px] inline-flex justify-center items-center gap-2.5 mt-4">
        {isAuthenticated ? (
          <AlertDialog
            title={"Are you sure?"}
            message={
              "You are switching to a new plan. This action cannot be undone. Your current plan and perks will be overridden."
            }
            onConfirm={handleClick}
          >
            <button>
              <div className="w-40 h-5 text-center justify-center text-white text-sm font-semibold">Subscribe</div>
            </button>
          </AlertDialog>
        ) : (
          <button onClick={handleClick}>
            <div className="w-40 h-5 text-center justify-center text-white text-sm font-semibold">Subscribe</div>
          </button>
        )}
      </div>
    );
  };

  const renderCurrentPlan = () => {
    return (
      <div className="inline-flex w-52 px-5 py-1 mt-2 ml-5 bg-appPrimary rounded-t-xl">
        <p className="font-semibold text-white mx-auto">Your Current Plan</p>
      </div>
    );
  };

  return (
    <>
      {/* {isAuthenticated && isCurrentPlan ? renderCurrentPlan() : <div className="mt-10" />} */}
      <motion.div
        className={`px-12 py-7 ${cardStyles} inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden`}
        whileHover={{ scale: 1.03 }}
      >
        <div className={`${plan.isHighlighted ? "pb-12" : "pb-5"} flex flex-col justify-start items-start gap-2.5`}>
          <div className={`w-96 h-7 inline-flex justify-between items-end ${plan.isHighlighted ? "gap-[5px]" : ""}`}>
            <div className="flex justify-start items-end gap-[5px]">
              <div className="justify-start text-black text-2xl font-semibold">{plan.title}</div>
              <div className="justify-start text-gray2 text-xs font-light">{plan.subtitle}</div>
            </div>
            {plan.isPopular && <div className="text-xs font-medium">✨Most popular</div>}
          </div>
          <div className="w-96 justify-start">
            <div className="text-gray2 text-xs font-normal">{plan.description}</div>
          </div>
        </div>
        <div className="self-stretch py-[5px] inline-flex justify-between items-end">
          <div className="flex justify-start items-end gap-[5px]">
            <div className="justify-start text-black text-xl font-bold">{plan.price}</div>
            <div className="justify-start text-gray2 text-xs font-light">{plan.priceUnit}</div>
          </div>
          <div className="justify-start text-gray2 text-[10px] font-light">Prices are maked in Vietnamese Dong</div>
        </div>
        {renderPurchaseButton()}
        {/* <button className="self-stretch px-12 py-2.5 bg-appPrimary rounded-[10px] inline-flex justify-center items-center gap-2.5">
        <div className="w-40 h-5 text-center justify-center text-white text-sm font-semibold">Subscribe</div>
      </button> */}
      </motion.div>
    </>
  );
};
