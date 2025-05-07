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
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting rank languages" });
      }
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
      <div key={index} className="flex items-center justify-between pt-3">
        <Skeleton className="w-2/3 h-6" />
        <Skeleton className="w-1/4 h-6" />
      </div>
    ));
  };

  const renderStatistic = () => {
    if (!languages) return null;

    return Object.entries(languages).map(([key, language]) => {
      if (!language) return null;
      return (
        <div key={key} className="flex items-center justify-between pt-3 text-base">
          <p>{language.name}</p>
          <p>{language.solved}</p>
        </div>
      );
    });
  };

  const renderEmpty = () => {
    return <div className="mt-4 text-base font-normal text-gray3">No data available</div>;
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
      <div className="w-full my-4 border-t-2 border-gray5"></div>
      <div className="flex flex-col min-w-full">
        <div className="text-xl font-semibold text-black1">Languages</div>
        {content}
      </div>
    </>
  );
};
