import { motion } from "framer-motion";
import { PRICING_PROMOTIONS } from "../../constants";
import { Tag } from "lucide-react";

interface PriceDisplayProps {
  planId: string;
  price: string;
  priceUnit: string;
}

export const PriceDisplay = ({ planId, price, priceUnit }: PriceDisplayProps) => {
  // console.log("plan id", planId);
  const isPromotionActive = PRICING_PROMOTIONS.isActive;
  const hasPromotion = isPromotionActive && (planId === "monthly" || planId === "yearly");
  const promotionalPrice = hasPromotion ? PRICING_PROMOTIONS[planId as "monthly" | "yearly"].promotionalPrice : null;
  // Get original price from the promotions configuration, not the current price
  const originalPrice = hasPromotion ? PRICING_PROMOTIONS[planId as "monthly" | "yearly"].originalPrice : price;

  return (
    <div className="flex flex-col">
      {hasPromotion && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-1"
        >
          <div className="text-base font-medium line-through text-gray3">{originalPrice}</div>
          <div className="bg-gradient-to-r from-appHard to-appAITo text-white text-xs px-2 py-0.5 rounded-full font-bold ml-2 flex items-center">
            <Tag size={12} className="mr-1" />
            PROMO
          </div>
        </motion.div>
      )}
      <div className="flex items-end">
        <span
          className={`${
            hasPromotion
              ? "text-2xl bg-gradient-to-r from-appPrimary to-appSecondary bg-clip-text text-transparent"
              : "text-xl text-black"
          } font-bold`}
        >
          {hasPromotion ? promotionalPrice : price}
        </span>
        <span className="ml-1 text-xs font-light text-gray-500">{priceUnit}</span>
      </div>
    </div>
  );
};
