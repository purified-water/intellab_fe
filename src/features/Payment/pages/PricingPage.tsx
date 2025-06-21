import { PLAN_FEATURES, PRICING_PLANS } from "../constants";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { PricingCard } from "../components/Pricing/PricingCard";
import { PerksList } from "../components/Pricing/PerkList";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import React, { Suspense } from "react";
import { Spinner } from "@/components/ui";
const AppFooter = React.lazy(() => import("@/components/AppFooter").then((module) => ({ default: module.AppFooter })));

export function PricingPage() {
  const { width } = useWindowDimensions();

  return (
    <>
      <SEO title="Pricing Plans | Intellab" />

      <div className="container px-4 py-12 mx-auto">
        <h1 className="text-[64px] font-bold text-center tracking-tight bg-gradient-to-r from-appPrimary to-appAccent bg-clip-text text-transparent">
          Intellab Premium
        </h1>
        <p className="text-center text-[18px] text-muted-foreground mt-4">
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
      <Suspense fallback={<Spinner className="size-6" loading />}>
        <AppFooter />
      </Suspense>
    </>
  );
}
