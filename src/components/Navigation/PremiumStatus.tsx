import { PREMIUM_PACKAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/rootReducer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const PremiumStatus = () => {
  const planDetails = {
    COURSE_PLAN: {
      title: "Course Plan",
      color: "border-appAccent text-appAccent hover:bg-appAccent hover:text-white"
    },
    ALGORITHM_PLAN: {
      title: "Algorithm Plan",
      color: "border-appSecondary text-appSecondary hover:bg-appSecondary hover:text-white"
    },
    PREMIUM_PLAN: {
      title: "Premium Plan",
      color: "border-appPrimary text-appPrimary hover:bg-appPrimary hover:text-white"
    }
  };

  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  if (!reduxPremiumStatus || reduxPremiumStatus.planType === PREMIUM_PACKAGES.RESPONSE.FREE) return null;

  const userPlan = reduxPremiumStatus?.planType as keyof typeof planDetails;
  // Get the plan details based on the user's plan
  const { title, color } = planDetails[userPlan] || planDetails["COURSE_PLAN"];
  if (reduxPremiumStatus.status !== "Active") return null;

  return (
    <Link to="/pricing">
      <button
        className={cn("px-3 py-1 text-[15px] font-semibold rounded-lg transition-colors duration-300 border", color)}
      >
        {title}
      </button>
    </Link>
  );
};
