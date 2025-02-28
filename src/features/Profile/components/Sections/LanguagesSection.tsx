import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { TRankLanguages } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export const LanguagesSection = () => {
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<TRankLanguages | null>(null);
  const toast = useToast();

  const getRankLanguagesAPI = async () => {
    try {
      const response = await userAPI.getProgressLanguage();
      if (response) {
        setLanguages(response);
      } else {
        showToastError({ toast: toast.toast, message: "Error getting rank languages" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting rank languages" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRankLanguagesAPI();
  }, []);

  const renderSkeleton = () => {
    const skeletons = [1, 2, 3]; // Number of skeleton items to render

    return (
      <>
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        <div className="flex flex-col min-w-full">
          <div className="text-2xl font-semibold text-black1">Languages</div>
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
    if (!languages) return null;

    const renderLanguage = (language: { name: string; solved: number }) => {
      return (
        <div className="flex items-center justify-between pt-4">
          <div className="text-lg font-normal text-black1">{language.name}</div>
          <div className="text-lg font-normal text-black1">{language.solved}</div>
        </div>
      );
    };

    return (
      <>
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        <div className="flex flex-col min-w-full">
          <div className="text-2xl font-semibold text-black1">Languages</div>
          {renderLanguage(languages.top1)}
          {renderLanguage(languages.top2)}
          {renderLanguage(languages.top3)}
        </div>
      </>
    );
  };

  let content = null;
  if (loading) {
    content = renderSkeleton();
  } else {
    if (languages) {
      content = renderStatistic();
    }
  }

  return content;
};
