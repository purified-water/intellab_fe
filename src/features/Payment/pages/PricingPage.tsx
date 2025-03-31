import { useState } from "react";
import { PricingBlock } from "../components";
import { PLANS } from "../constants";
import { PREMIUM_DURATION } from "@/constants";
import useWindowDimensions from "@/hooks/use-window-dimensions";

export function PricingPage() {
  const { width } = useWindowDimensions();

  const [selectedDuration, setSelectedDuration] = useState<(typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION]>(
    PREMIUM_DURATION.MONTHLY
  );

  const renderPlans = () => {
    let blocksPerRow = 4;
    if (width < 1300) {
      blocksPerRow = 2;
    }
    if (width < 700) {
      blocksPerRow = 1;
    }

    const rows = [];

    for (let i = 0; i < PLANS.length; i += blocksPerRow) {
      rows.push(PLANS.slice(i, i + blocksPerRow));
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center w-full space-x-[30px] mb-6">
        {row.map((plan, index) => (
          <PricingBlock key={index} plan={plan} duration={selectedDuration} />
        ))}
      </div>
    ));
  };

  const renderButtons = () => {
    const Button = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
      <button
        className={`w-[110px] h-[45px] rounded-[10px] font-semibold text-lg ${isSelected ? "bg-appPrimary text-white" : "border border-black"}`}
        onClick={onClick}
      >
        {label}
      </button>
    );

    return (
      <div className="space-x-2 mb-4">
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
      <p className="text-4xl font-semibold pt-7 pb-3">Intellab Pricing Plans</p>
      <p className="text-2xl font-normal mb-4">Choose the right plan for your learning journey!</p>
      {renderButtons()}
      {renderPlans()}
    </div>
  );
}
