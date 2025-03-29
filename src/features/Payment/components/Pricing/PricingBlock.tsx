import { TPlan } from "../../types";
import { PerkInformationRow } from "./PerkInformationRow";
import { paymentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { PREMIUM_DURATION, PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import { AlertDialog } from "@/components/ui";
import useWindowDimensions from "@/hooks/use-window-dimensions";

type PrickingBlockProps = {
  plan: TPlan;
  duration: (typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION];
};

export function PricingBlock(props: PrickingBlockProps) {
  const { plan, duration } = props;

  const { width } = useWindowDimensions();

  const {
    title,
    titleColor,
    monthPrice,
    yearPrice,
    eachMonthPrice,
    description,
    perks,
    requestPackage,
    responsePackage,
    purchaseButtonText
  } = plan;

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);

  const usingFreePlan = reduxPremiumStatus?.planType === PREMIUM_PACKAGES.RESPONSE.FREE;
  const isCurrentPlan =
    reduxPremiumStatus?.planType === responsePackage && reduxPremiumStatus?.durationEnums === duration;
  const isFreePlan = requestPackage === PREMIUM_PACKAGES.REQUEST.FREE;
  const isCurrenPlanActive = reduxPremiumStatus?.status == PREMIUM_STATUS.ACTIVE;

  const toast = useToast();

  const createPremiumPaymentAPI = async () => {
    await paymentAPI.createPremiumPayemnt({
      body: {
        premiumPackage: requestPackage!,
        premiumDuration: duration,
        isChangePlan: isCurrenPlanActive
      },
      onSuccess: async (data) => {
        window.location.href = data.paymentUrl!;
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error })
    });
  };

  const renderCurrentPlan = () => {
    return (
      <div className="bg-appPrimary inline-flex py-2 px-5 rounded-t-xl ml-5">
        <p className="font-semibold text-white text-sm">Your Current Plan</p>
      </div>
    );
  };

  const renderPrices = () => {
    let displayPrice = monthPrice;
    if (!isFreePlan && duration == PREMIUM_DURATION.YEARLY) {
      displayPrice = eachMonthPrice!;
    }

    return (
      <>
        {!isFreePlan && duration == PREMIUM_DURATION.YEARLY && (
          <p className="text-sm font-medium">Billed anually ({yearPrice.toLocaleString()} VNĐ)</p>
        )}
        <div className="items-end mb-2">
          <span className="text-[32px] font-bold text-2xl">đ{displayPrice.toLocaleString()}</span>
          <span className="text-2xl font-medium">/</span>
          <span className="text-lg font-medium">month</span>
        </div>
      </>
    );
  };

  const renderPerks = () => {
    return perks.map((perk, index) => <PerkInformationRow key={index} content={perk} />);
  };

  const renderPurchaseButton = () => {
    const handlePurchaseClick = async () => {
      if (isAuthenticated) {
        await createPremiumPaymentAPI();
      } else {
        showToastError({ toast: toast.toast, message: "Please login to purchase plan" });
      }
    };

    let button = null;
    if (!isAuthenticated || isFreePlan || usingFreePlan) {
      button = (
        <button
          onClick={handlePurchaseClick}
          className="w-[242px] h-[45px] font-bold text-base text-white bg-appPrimary rounded-[10px] hover:opacity-80"
        >
          {purchaseButtonText}
        </button>
      );
    } else {
      button = (
        <AlertDialog
          title={"Are you sure?"}
          message={
            "You are switching to a new plan. This action cannot be undone. Your current plan and perks will be overridden."
          }
          onConfirm={handlePurchaseClick}
        >
          <div className="w-[242px] h-[45px] font-bold text-white text-base bg-appPrimary rounded-[10px] hover:opacity-80 flex items-center justify-center">
            {purchaseButtonText}
          </div>
        </AlertDialog>
      );
    }

    return <div className="mt-4 ml-auto mr-auto">{button}</div>;
  };

  return (
    <div>
      {isAuthenticated && !isFreePlan && isCurrentPlan && isCurrenPlanActive ? (
        renderCurrentPlan()
      ) : (
        <div className="mt-10" />
      )}
      <div
        className="rounded-[10px] flex flex-col justify-start p-5 border border-gray4 text-gray1"
        style={{
          width: width / 7,
          height: "570px",
          minWidth: "300px"
        }}
      >
        <p className={`text-xl text-${titleColor} font-bold mb-2`}>{title}</p>
        {renderPrices()}
        <div className="text-lg font-light mb-4">{description}</div>
        {renderPerks()}
        <div className="flex-grow mt-20"></div>
        {!isFreePlan && !isCurrentPlan && renderPurchaseButton()}
      </div>
    </div>
  );
}
