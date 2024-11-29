import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import React from "react";

interface PricingPlanProps {
  planName: string;
  price: string;
  description: string;
  privileges: string[];
}

const PremiumPlan: React.FC<PricingPlanProps> = ({ planName, price, description, privileges }) => {
  const isFreePlan = price === "đ0";

  return (
    <div
      className={`w-[338px] h-[553px] rounded-[10px] flex flex-col justify-start p-5 ${isFreePlan ? "border border-gray5" : "border border-appPrimary"}`}
    >
      <div className="w-[200px] h-[28.33px] text-appPrimary text-2xl font-bold">{planName}</div>
      <div className="w-[107px] h-[38.10px] mt-2 mb-2">
        <span className="text-appPrimary text-[32px] font-bold">{price}</span>
        <span className="text-2xl font-medium text-appPrimary">/</span>
        <span className="text-lg font-medium text-appPrimary">month</span>
      </div>
      <div className="w-[246px] h-[21.49px] text-appPrimary text-lg font-light mb-14">{description}</div>
      {privileges.map((privilege, index) => (
        <div key={index} className="flex items-baseline mb-2 space-x-3">
          <i className="text-appPrimary fa-regular fa-circle-check" />{" "}
          <div className="w-[250px] h-[21.49px] text-appPrimary text-lg">{privilege}</div>
        </div>
      ))}
      {!isFreePlan && (
        <div className="mt-24 ml-auto mr-auto">
          <button className="w-[242px] h-[60px] font-bold text-white bg-appPrimary rounded-[10px]">Get started</button>
        </div>
      )}
    </div>
  );
};

export const PricingPage: React.FC = () => {
  const freePlanPrivileges = [
    "Access to public algorithms",
    "Access to free courses",
    "Level 1 hints",
    "Code review with AI",
    "AI Chatbot"
  ];

  const premiumPlanPrivileges = [
    "All perks from Free plan",
    "Access to all courses",
    "All-level hints",
    "Personal code review with AI",
    "AI Chatbot",
    "Debugger in playground"
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[#01000f] text-4xl font-semibold pt-7 pb-3">Intellab Pricing Plans</div>
      <div className="text-[#01000f] text-2xl font-normal mb-20">Choose the right plan for your learning journey!</div>
      <div className="flex justify-center w-full space-x-[90px] item-center">
        <PremiumPlan
          planName="Free plan"
          price="đ0"
          description="Basic plan for casual learners"
          privileges={freePlanPrivileges}
        />
        <PremiumPlan
          planName="Premium plan"
          price="đ100,000"
          description="Perfect plan for algorithm enthusiasts"
          privileges={premiumPlanPrivileges}
        />
      </div>
    </div>
  );
};
