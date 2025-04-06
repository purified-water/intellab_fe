import { useEffect, useState } from "react";
import { PricingBlock } from "../components";
import { PLANS } from "../constants";
import { PREMIUM_DURATION } from "@/constants";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { AppFooter } from "@/components/AppFooter";
import { motion } from "framer-motion";

export function PricingPage() {
  const { width } = useWindowDimensions();

  useEffect(() => {
    document.title = "Pricing | Intellab";
  }, []);

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

    return (
      <motion.div
        key={selectedDuration} // Forces re-animation on duration change
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center w-full space-x-[30px] mb-6">
            {row.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PricingBlock plan={plan} duration={selectedDuration} />
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>
    );
  };

  const renderButtons = () => {
    const Button = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
      <button
        className={`w-[110px] py-[5px] rounded-lg font-semibold text-lg ${isSelected ? "bg-appPrimary text-white" : "border border-black"}`}
        onClick={onClick}
      >
        {label}
      </button>
    );

    return (
      <div className="space-x-2">
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
      <p className="mb-2 text-4xl font-semibold text-transparent mt-7 bg-gradient-to-r from-appPrimary to-appAccent bg-clip-text">
        Intellab Pricing Plans
      </p>
      <p className="mb-4 text-2xl font-light text-gray2">Choose the right plan for your learning journey!</p>
      {renderButtons()}
      {renderPlans()}

      <AppFooter />
    </div>
  );
}
