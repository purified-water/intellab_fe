import { TProgress } from "@/types";
import { userAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { showToastError } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type LevelsSectionProps = {
  userId: string;
};

export const LevelsSection = (props: LevelsSectionProps) => {
  const { userId } = props;

  const [loading, setLoading] = useState(false);
  const [level, setLevels] = useState<TProgress | null>(null);
  const toast = useToast();

  const getProgressProblemAPI = async () => {
    setLoading(true);
    try {
      const progress = await userAPI.getProgressLevel(userId);
      if (progress) {
        setLevels(progress);
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
    getProgressProblemAPI();
  }, [userId]);

  const renderSkeleton = () => {
    const skeletons = [1, 2, 3]; // Number of skeleton items to render

    return (
      <>
        <div className="w-full my-4 border-t-2 border-gray5"></div>
        <div className="flex flex-col min-w-full">
          <div className="text-2xl font-semibold text-black1">Levels</div>
          {skeletons.map((_, index) => (
            <div key={index} className="flex items-center justify-between pt-3">
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
        <div className="w-full my-4 border-t-2 border-gray5"></div>
        <div className="flex flex-col min-w-full">
          <div className="text-xl font-semibold text-black1">Levels</div>
          {levels.map((item, index) => (
            <div key={index} className="flex items-center justify-between pt-3 text-base text-black1">
              <p>{item.level}</p>
              <p>{item.solved}</p>
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
