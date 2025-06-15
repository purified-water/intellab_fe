import { TProgress } from "@/types";
import { userAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { showToastError } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

type StatsSectionProps = {
  userId: string;
};

export const StatsSection = (props: StatsSectionProps) => {
  const { userId } = props;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<TProgress | null>(null);
  const toast = useToast();
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const reduxLoginStreak = useSelector((state: RootState) => state.user.loginStreak);
  const isMe = userId === reduxUser?.userId;

  const getProgressProblemAPI = async (userId: string | null) => {
    setLoading(true);
    try {
      const progress = await userAPI.getProgressLevel(userId);
      if (progress) {
        setProgress(progress);
      } else {
        showToastError({ toast: toast.toast, message: "Error getting problem statistics" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting problem statistics" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProgressProblemAPI(userId);
  }, [userId]);

  const renderSkeleton = () => {
    const skeletons = [1, 2, 3]; // Number of skeleton items to render

    return skeletons.map((_, index) => (
      <div key={index} className="flex items-center justify-between pt-3">
        <Skeleton className="w-2/3 h-6" />
        <Skeleton className="w-1/4 h-6" />
      </div>
    ));
  };

  const renderStats = () => {
    if (!progress) return null;

    const { easy, medium, hard } = progress;

    const stats = [
      { label: "Problems Solved", value: easy.solved + medium.solved + hard.solved },
      { label: "Completed Courses", value: reduxUser?.courseCount || 0 },
      { label: "Login Streak", value: reduxLoginStreak || 0 }
    ];

    return stats.map((stat, index) => (
      <div key={index} className="flex items-center justify-between pt-3 text-base text-black1">
        <p>{stat.label}</p>
        <p>{stat.value}</p>
      </div>
    ));
  };

  return (
    <>
      <div className="w-full my-4 border-t-2 border-gray5"></div>
      <div className="flex flex-col min-w-full">
        <div className="text-xl font-semibold text-black1">{isMe ? "My Stats" : "Stats"}</div>
        {loading ? renderSkeleton() : renderStats()}
      </div>
    </>
  );
};
