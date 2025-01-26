import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/Separator";
import { Progress } from "@/types";
import { userAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export const ProgressCircle = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetProgress = async (userId: string) => {
    const progress = await userAPI.getProgress(userId);
    if (progress) {
      setProgress(progress);
    }
  };

  useEffect(() => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    if (userId) {
      handleGetProgress(userId);
    }
    setLoading(false);
  }, []);

  const renderSkeleton = () => {
    return (
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-around">
        <div className="relative w-32 h-32 min-w-fit">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="w-full space-y-2 text-left md:w-72">
          <div className="flex justify-between text-sm gap-2">
            <Skeleton className="w-64 h-4" />
            <Skeleton className="w-64 h-4" />
          </div>
          <div className="flex justify-between text-sm gap-2">
            <Skeleton className="w-64 h-4" />
            <Skeleton className="w-64 h-4" />
          </div>
          <div className="flex justify-between text-sm gap-2">
            <Skeleton className="w-64 h-4" />
            <Skeleton className="w-64 h-4" />
          </div>
          <div className="flex justify-between text-sm gap-2">
            <Skeleton className="w-64 h-4" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (progress === null) return null;

    const { easy, medium, hard, totalProblems } = progress;
    const totalSolved = easy.solved + medium.solved + hard.solved;
    const totalPercentage = Math.round((totalSolved / totalProblems) * 100);

    const radius = 45; // 45% of the viewbox
    const strokeCircumference = 2 * Math.PI * radius;
    const strokeDashOffset = strokeCircumference - (strokeCircumference * totalPercentage) / 100;

    return (
      <div id="progress" className="flex flex-col items-center gap-4 md:flex-row md:justify-around">
        <div className="relative w-20 h-20 min-w-fit">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100" // Ensure a consistent viewBox
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              fill="transparent"
              className="text-gray5"
              stroke="currentColor"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              fill="transparent"
              className="text-appPrimary"
              stroke="currentColor"
              strokeDasharray={strokeCircumference}
              strokeDashoffset={strokeDashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm font-semibold text-gray3 md:text-xl">{totalPercentage}%</div>
          </div>
        </div>

        <div className="w-full space-y-2 text-left md:w-32">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Solved:</span>
            <span>
              {totalSolved}/{totalProblems}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-appEasy">Easy:</span>
            <span>
              {easy.solved}/{easy.max}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-appMedium">Medium:</span>
            <span>
              {medium.solved}/{medium.max}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-appHard">Hard:</span>
            <span>
              {hard.solved}/{hard.max}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-4 overflow-x-auto border border-gray5 rounded-md">
      <div className="text-xl font-bold text-appPrimary">Your Progress</div>
      <Separator className="mt-2 mb-5" />
      {loading ? renderSkeleton() : renderContent()}
    </div>
  );
};
