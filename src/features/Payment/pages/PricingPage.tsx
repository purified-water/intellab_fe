import { useState } from "react";
import { PricingBlock } from "../components";
import { PLANS } from "../constants";
import { PREMIUM_DURATION } from "@/constants";

export function PricingPage() {
  const [selectedDuration, setSelectedDuration] = useState<(typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION]>(
    PREMIUM_DURATION.MONTHLY
  );
  const renderPlans = () => {
    return PLANS.map((plan, index) => <PricingBlock key={index} plan={plan} duration={selectedDuration} />);
  };

  const renderButtons = () => {
    const Button = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
      <button
        className={`w-[120px] h-[45px] rounded-[10px] ${isSelected ? "bg-appPrimary text-white" : "border border-black"}`}
        onClick={onClick}
      >
        {label}
      </button>
    );

    return (
      <div className="space-x-2 font-bold mb-4">
        <Button
          label="Monthly"
          isSelected={selectedDuration === PREMIUM_DURATION.MONTHLY}
          onClick={() => setSelectedDuration(PREMIUM_DURATION.MONTHLY)}
        />
        <Button
          label="Yearly"
          isSelected={selectedDuration === PREMIUM_DURATION.YEARLY}
          onClick={() => setSelectedDuration(PREMIUM_DURATION.YEARLY)}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-4xl font-semibold pt-7 pb-3">Intellab Pricing Plans</div>
      <div className="text-2xl font-normal mb-4">Choose the right plan for your learning journey!</div>
      {renderButtons()}
      <div className="flex justify-center w-full space-x-[30px] item-center">{renderPlans()}</div>
    </div>
  );
}
