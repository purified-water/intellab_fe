import { TPlan } from "../../types";
import { PerkInformationRow } from "./PerkInformationRow";
import { paymentAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { DURATION, PACKAGES } from "../../constants";
import { AlertDialog } from "@/components/ui";

type PrickingBlockProps = {
  plan: TPlan;
  duration: (typeof DURATION)[keyof typeof DURATION];
};

export function PricingBlock(props: PrickingBlockProps) {
  const { plan, duration } = props;

  const {
    isFreePlan,
    title,
    titleColor,
    monthPrice,
    yearPrice,
    eachMonthPrice,
    description,
    perks,
    planPackage,
    purchaseButtonText
  } = plan;

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const premiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);

  const isCurrentPlan = premiumStatus?.planType === planPackage;
  //const isCurrentPlan = (PACKAGES.COURSE == planPackage && duration == DURATION.MONTHLY); // Note: for tesing

  const toast = useToast();

  const createPremiumPaymentAPI = async () => {
    await paymentAPI.createPremiumPayemnt({
      body: {
        premiumPackage: planPackage!,
        premiumDuration: duration
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
        <p className="font-semibold text-white">Your Current Plan</p>
      </div>
    );
  };

  const renderPrices = () => {
    let displayPrice = monthPrice;
    if (!isFreePlan && duration == DURATION.YEARLY) {
      displayPrice = eachMonthPrice!;
    }

    return (
      <>
        {!isFreePlan && duration == DURATION.YEARLY && <p>Billed anually ({yearPrice} VNĐ)</p>}
        <div className="items-end mb-2">
          <span className="text-[32px] font-bold">đ{displayPrice.toLocaleString()}</span>
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
    if (premiumStatus?.planType == PACKAGES.FREE) {
      button = (
        <button
          onClick={handlePurchaseClick}
          className="w-[242px] h-[45px] font-bold text-white bg-appPrimary rounded-[10px] hover:opacity-80"
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
          <button className="w-[242px] h-[45px] font-bold text-white bg-appPrimary rounded-[10px] hover:opacity-80">
            {purchaseButtonText}
          </button>
        </AlertDialog>
      );
    }

    return <div className="mt-4 ml-auto mr-auto">{button}</div>;
  };

  return (
    <div>
      {isAuthenticated && !isFreePlan && isCurrentPlan ? renderCurrentPlan() : <div className="mt-10" />}
      <div className="w-[338px] h-[600px]  rounded-[10px] flex flex-col justify-start p-5 border border-gray4 text-gray1">
        <p className={`text-2xl text-${titleColor} font-bold mb-2`}>{title}</p>
        {renderPrices()}
        <div className="text-lg font-light mb-4">{description}</div>
        {renderPerks()}
        <div className="flex-grow mt-20"></div>
        {!isFreePlan && !isCurrentPlan && renderPurchaseButton()}
      </div>
    </div>
  );
}
