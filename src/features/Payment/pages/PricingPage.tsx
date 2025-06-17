import { PLAN_FEATURES, PRICING_PLANS } from "../constants";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { AppFooter } from "@/components/AppFooter";
import { PricingCard } from "../components/Pricing/PricingCard";
import { PerksList } from "../components/Pricing/PerkList";
import { motion } from "framer-motion";

export function PricingPage() {
  const { width } = useWindowDimensions();

  return (
    <>
      <div className="container px-4 py-12 mx-auto">
        <h1 className="text-[64px] font-extrabold text-center bg-gradient-to-r from-appPrimary to-appAccent bg-clip-text text-transparent">
          Intellab Premium
        </h1>
        <p className="text-center text-[18px] text-gray-600 mt-4">
          Get started with an Intellab subscription that works for you
        </p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col lg:flex-row items-center justify-center mt-8 space-y-8 lg:space-y-0 lg:space-x-[40px] px-4 lg:px-96"
        >
          <div className="flex flex-col flex-1">
            <PricingCard plan={PRICING_PLANS[0]}></PricingCard>
            {width > 1024 && <PerksList perks={PLAN_FEATURES.slice(0, 4)}></PerksList>}
          </div>
          <div className="flex flex-col flex-1">
            <PricingCard plan={PRICING_PLANS[1]}></PricingCard>
            {width <= 1024 && <PerksList perks={PLAN_FEATURES.slice(0, 4)}></PerksList>}
            <PerksList perks={PLAN_FEATURES.slice(4)}></PerksList>
          </div>
        </motion.div>
      </div>
      <AppFooter />
    </>
  );
}
