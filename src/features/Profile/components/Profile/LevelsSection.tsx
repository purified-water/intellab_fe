import { TProgress } from "@/types";
import { userAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { showToastError } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { getUserIdFromLocalStorage } from "@/utils";

export const LevelsSection = () => {
  const [loading, setLoading] = useState(true);
  const [level, setLevels] = useState<TProgress | null>(null);
  const toast = useToast();
  const userId = getUserIdFromLocalStorage();

  const getProgressProblemAPI = async () => {
    try {
      const progress = await userAPI.getProgressLevel(userId);
      if (progress) {
        setLevels(progress);
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
    getProgressProblemAPI();
  }, []);

  const renderSkeleton = () => {
    const skeletons = [1, 2, 3]; // Number of skeleton items to render

    return (
      <>
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        <div className="flex flex-col min-w-full">
          <div className="text-2xl font-semibold text-black1">Levels</div>
          {skeletons.map((_, index) => (
            <div key={index} className="flex items-center justify-between pt-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderStatistic = () => {
    if (!level) return null;

    const { easy, medium, hard } = level;

    const levels = [
      { level: "Easy", solved: easy.solved },
      { level: "Medium", solved: medium.solved },
      { level: "Hard", solved: hard.solved }
    ];

    return (
      <>
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        <div className="flex flex-col min-w-full">
          <div className="text-2xl font-semibold text-black1">Levels</div>
          {levels.map((item, index) => (
            <div key={index} className="flex items-center justify-between pt-4">
              <div className="text-lg font-normal text-black1">{item.level}</div>
              <div className="text-lg font-normal text-black1">{item.solved}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  let content = null;
  if (loading) {
    content = renderSkeleton();
  } else {
    if (level && Object.keys(level).length > 0) {
      content = renderStatistic();
    }
  }
  return content;
};
