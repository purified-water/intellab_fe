import { TProgress } from "@/types";
import { userAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getUserIdFromLocalStorage } from "@/utils";
import { useState, useEffect } from "react";
import { showToastError } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export const StatsSection = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<TProgress | null>(null);
  const toast = useToast();

  const userId = getUserIdFromLocalStorage();

  const getProgressProblemAPI = async (userId: string | null) => {
    try {
      const progress = await userAPI.getProgressProblem(userId);
      if (progress) {
        setProgress(progress);
      } else {
        showToastError({ toast: toast.toast, message: "Error getting problem statistics" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting problem statistics" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProgressProblemAPI(userId);
  }, []);

  const renderSkeleton = () => {
    const skeletons = [1, 2, 3]; // Number of skeleton items to render

    return skeletons.map((_, index) => (
      <div key={index} className="flex items-center justify-between pt-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    ));
  };

  const renderStats = () => {
    if (!progress) return null;

    const { easy, medium, hard } = progress;

    const stats = [
      { label: "Problems Solved", value: easy.solved + medium.solved + hard.solved },
      { label: "Completed Courses", value: "15" },
      { label: "Login Streak", value: "15 days" }
    ];

    return stats.map((stat, index) => (
      <div key={index} className="flex items-center justify-between pt-4">
        <div className="text-lg font-normal text-black1">{stat.label}</div>
        <div className="text-lg font-normal text-black1">{stat.value}</div>
      </div>
    ));
  };

  return (
    <>
      <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
      <div className="flex flex-col min-w-full">
        <div className="text-2xl font-semibold text-black1">My Stats</div>
        {loading ? renderSkeleton() : renderStats()}
      </div>
    </>
  );
};
