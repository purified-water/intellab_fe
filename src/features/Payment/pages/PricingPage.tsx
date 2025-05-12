import { PLAN_FEATURES, PRICING_PLANS } from "../constants";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { AppFooter } from "@/components/AppFooter";
import { PricingCard } from "../components/Pricing/PricingCard";
import { PerksList } from "../components/Pricing/PerkList";
import { motion } from "framer-motion";

export function PricingPage() {
  const { width } = useWindowDimensions();
  // const toast = useToast();

  // useEffect(() => {
  //   document.title = "Pricing | Intellab";
  // }, []);

  // const getDiscountAPI = async (userId: string) => {
  //   await paymentAPI.getDiscount({
  //     query: { userId },
  //     onSuccess: async (data) => setDiscountValue(data.discountValue),
  //     onFail: async (message) => showToastError({ toast: toast.toast, message })
  //   });
  // };

  // useEffect(() => {
  //   const userId = getUserIdFromLocalStorage();
  //   if (userId) {
  //     getDiscountAPI(userId);
  //   }
  // }, []);

  // const [selectedDuration, setSelectedDuration] = useState<(typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION]>(
  //   PREMIUM_DURATION.MONTHLY
  // );

  // const [discountValue, setDiscountValue] = useState<number>(0);

  // const renderPlans = () => {
  //   let blocksPerRow = 4;
  //   if (width < 1400) {
  //     blocksPerRow = 2;
  //   }
  //   if (width < 700) {
  //     blocksPerRow = 1;
  //   }

  //   const rows = [];
  //   for (let i = 0; i < PLANS.length; i += blocksPerRow) {
  //     rows.push(PLANS.slice(i, i + blocksPerRow));
  //   }

  //   return (
  //     <motion.div
  //       key={selectedDuration} // Forces re-animation on duration change
  //       initial={{ opacity: 0, y: 50 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.6 }}
  //     >
  //       {rows.map((row, rowIndex) => (
  //         <div key={rowIndex} className="flex justify-center w-full space-x-[20px]">
  //           {row.map((plan, index) => (
  //             <motion.div
  //               key={index}
  //               initial={{ opacity: 0, y: 50 }}
  //               animate={{ opacity: 1, y: 0 }}
  //               transition={{ duration: 0.6, delay: index * 0.2 }}
  //             >
  //               <PricingBlock plan={plan} duration={selectedDuration} discountValue={discountValue} />
  //             </motion.div>
  //           ))}
  //         </div>
  //       ))}
  //     </motion.div>
  //   );
  // };

  // const renderPerksTable = () => {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0, y: 50 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.6, delay: 0.8 }} // Delay to ensure it appears after renderPlans animation
  //       className="flex justify-center w-full mt-12"
  //     >
  //       <div style={{ minWidth: "1200px", width: width * 0.6 }}>
  //         <PerksTable />
  //       </div>
  //     </motion.div>
  //   );
  // };

  // const renderButtons = () => {
  //   const Button = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
  //     <button
  //       className={`w-[110px] py-[5px] rounded-lg font-semibold text-lg ${isSelected ? "bg-appPrimary text-white" : "border border-black"}`}
  //       onClick={onClick}
  //     >
  //       {label}
  //     </button>
  //   );

  //   return (
  //     <div className="space-x-2">
  //       <Button
  //         label="Monthly"
  //         isSelected={selectedDuration === PREMIUM_DURATION.MONTHLY}
  //         onClick={() => setSelectedDuration(PREMIUM_DURATION.MONTHLY)}
  //       />
  //       <Button
  //         label="Yearly"
  //         isSelected={selectedDuration === PREMIUM_DURATION.YEARLY}
  //         onClick={() => setSelectedDuration(PREMIUM_DURATION.YEARLY)}
  //       />
  //     </div>
  //   );
  // };

  // return (
  //   <div className="flex flex-col items-center justify-center">
  //     <p className="mt-5 mb-2 text-4xl font-semibold text-transparent bg-gradient-to-r from-appPrimary to-appAccent bg-clip-text">
  //       Intellab Pricing Plans
  //     </p>
  //     <p className="mb-4 text-2xl font-light text-gray2">Choose the right plan for your learning journey!</p>
  //     {renderButtons()}
  //     {renderPlans()}
  //     {renderPerksTable()}
  //     <AppFooter />
  //   </div>
  // );

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
          <div className="flex flex-col flex-1 mb-5">
            <PricingCard plan={PRICING_PLANS[0]}></PricingCard>
            {/* <div className="mt-5"></div> */}
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
