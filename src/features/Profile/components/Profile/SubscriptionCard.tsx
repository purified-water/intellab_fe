import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Code, Crown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type PlanType = "course" | "algorithm" | "premium";

interface SubscriptionCardProps {
  type: PlanType;
  userId: string;
  loading: boolean;
}

const planDetails = {
  course: {
    title: "Course Plan",
    color: "from-pink-50 to-appFadedAccent text-appAccent",
    icon: <BookOpen className="w-10 h-10 text-appAccent" />
  },
  algorithm: {
    title: "Algorithm Plan",
    color: "from-blue-50 to-appFadedSecondary text-appSecondary",
    icon: <Code className="w-10 h-10 text-appSecondary" />
  },
  premium: {
    title: "Premium Plan",
    color: "from-appFadedAccent to-appFadedSecondary text-appPrimary",
    icon: <Crown className="w-10 h-10 text-appPrimary" />
  }
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ type, userId, loading }) => {
  const { title, color, icon } = planDetails[type];
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isMe = userId === reduxUser?.userId;

  if (!userId || !isMe) return null;

  if (loading) {
    return (
      <div className="w-full h-[130px] bg-white rounded-t-lg">
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
      <div className={cn("p-4 bg-gradient-to-tr rounded-t-lg", color)}>
        <div className="flex items-center justify-between pr-2">
          <div className="flex flex-col">
            <p className="text-sm text-gray1">Current Plan</p>
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <p className="text-xs text-gray-600">Renew on January 25, 2025</p>
        <button className="text-sm text-appPrimary hover:underline">View all plans &gt;</button>
      </div>
    </div>
  );
};
