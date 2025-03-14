import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { TRankLanguages } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type LanguagesSectionProps = {
  userId: string;
};

export const LanguagesSection = (props: LanguagesSectionProps) => {
  const { userId } = props;

  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<TRankLanguages | null>(null);
  const toast = useToast();

  const getRankLanguagesAPI = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProgressLanguage(userId);
      if (response) {
        setLanguages(response);
      } else {
        showToastError({ toast: toast.toast, message: "Error getting rank languages" });
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting rank languages" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRankLanguagesAPI();
  }, [userId]);

  const renderSkeleton = () => {
    const skeletons = [1, 2, 3]; // Number of skeleton items to render

    return skeletons.map((_, index) => (
      <div key={index} className="flex items-center justify-between pt-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    ));
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
        {renderLanguage(languages.top1)}
        {renderLanguage(languages.top2)}
        {renderLanguage(languages.top3)}
      </>
    );
  };

  const renderEmpty = () => {
    return <div className="text-lg font-normal text-gray3 mt-4">No data available</div>;
  };

  let content = null;
  if (loading) {
    content = renderSkeleton();
  } else {
    if (languages && Object.keys(languages).length > 0) {
      content = renderStatistic();
    } else {
      content = renderEmpty();
    }
  }

  return (
    <>
      <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
      <div className="flex flex-col min-w-full">
        <div className="text-2xl font-semibold text-black1">Languages</div>
        {content}
      </div>
    </>
  );
};
