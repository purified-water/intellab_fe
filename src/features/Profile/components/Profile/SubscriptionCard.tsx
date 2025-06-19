import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Code, Crown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useNavigate } from "react-router-dom";
import { shortenDate } from "@/utils";
import { PREMIUM_PACKAGES } from "@/constants";

interface SubscriptionCardProps {
  userId: string;
  loading: boolean;
}

const planDetails = {
  free: {
    title: "Free Plan",
    color: "from-white to-appFadedAccent text-appAccent",
    icon: <BookOpen className="w-10 h-10 text-appAccent" />
  },
  COURSE_PLAN: {
    title: "Course Plan",
    color: "from-white to-appFadedAccent text-appAccent",
    icon: <BookOpen className="w-10 h-10 text-appAccent" />
  },
  ALGORITHM_PLAN: {
    title: "Algorithm Plan",
    color: "from-blue-50 to-appFadedSecondary text-appSecondary",
    icon: <Code className="w-10 h-10 text-appSecondary" />
  },
  PREMIUM_PLAN: {
    title: "Premium Plan",
    color: "from-purple-50 to-appFadedPrimary text-appPrimary",
    icon: <Crown className="w-10 h-10 text-appPrimary" />
  }
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ userId, loading }) => {
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isMe = userId === reduxUser?.userId;
  const navigate = useNavigate();
  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);

  if (!reduxPremiumStatus || reduxPremiumStatus.planType === PREMIUM_PACKAGES.RESPONSE.FREE) return null;

  const userPlan = reduxPremiumStatus?.planType as keyof typeof planDetails;
  // Get the plan details based on the user's plan
  const { title, color, icon } = planDetails[userPlan] || planDetails["free"];
  const planEndDate = reduxPremiumStatus?.endDate;

  if (!userId || !isMe || reduxPremiumStatus.status !== "Active") return null;

  if (loading) {
    return (
      <div className="w-full h-[130px] bg-white rounded-lg">
        <Skeleton className="w-full h-20 p-4 rounded-t-lg " />
        <div className="flex items-center justify-between px-4 py-3">
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[130px] bg-white rounded-lg">
      <div className={cn("px-4 py-5 bg-gradient-to-tr rounded-t-lg", color)}>
        <div className="flex items-center justify-between pr-2">
          <div className="flex flex-col">
            {/* <p className={`text-xs ${type === "course" ? "text-appHard" : type === "algorithm" ? "text-appSecondary" : "text-appPrimary"} `}>Current Plan</p> */}
            <p className="text-xs text-gray2">Current Plan</p>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <p className="text-xs text-gray-600">Renew on {shortenDate(planEndDate!)}</p>
        <button type="button" onClick={() => navigate("/pricing")} className="text-xs font-medium">
          View all plans &gt;
        </button>
      </div>
    </div>
  );
};
