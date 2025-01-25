import { useState, useEffect } from "react";
import {
  ProfileSection,
  StatsSection,
  LanguagesSection,
  LevelsSection,
  Badges,
  Courses,
  Submissions
} from "@/features/Profile/components";
import { Progress } from "@/types";
import { userAPI } from "@/lib/api";

export const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

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

  return (
    <div className="flex flex-col items-start justify-between min-h-screen px-10 pt-10 bg-gray5 lg:flex-row">
      <div className="flex flex-col items-start p-4 sm:p-10 w-full lg:w-[470px] h-auto lg:h-[1100px] mb-10 lg:mb-20 bg-white rounded-[10px]">
        <ProfileSection />
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        {!loading && progress && <StatsSection progress={progress} />}
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        <LanguagesSection />
        <div className="w-full my-4 border-t-2 border-gray5 lg:my-10"></div>
        {!loading && progress && <LevelsSection progress={progress} />}
      </div>
      <div className="flex flex-col w-full min-h-screen space-y-4 lg:space-y-10 lg:ml-10">
        <Badges></Badges>
        <Courses></Courses>
        <Submissions></Submissions>
      </div>
    </div>
  );
};
