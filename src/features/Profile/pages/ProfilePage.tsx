import { useParams } from "react-router-dom";
import {
  ProfileSection,
  StatsSection,
  LanguagesSection,
  LevelsSection,
  Badges,
  CompletedCourseList,
  SubmissionList
} from "@/features/Profile/components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useEffect } from "react";

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    document.title = `${user?.displayName} | Intellab`;
  }, [user]);

  return (
    <div className="flex flex-col items-start justify-between min-h-screen px-20 pt-10 bg-gray5 lg:flex-row">
      <div className="flex flex-col items-start p-4 sm:p-10 w-full lg:w-[470px] h-auto lg:h-[1100px] mb-10 lg:mb-20 bg-white rounded-[10px]">
        <ProfileSection userId={id!} />
        <StatsSection userId={id!} />
        <LanguagesSection userId={id!} />
        <LevelsSection userId={id!} />
      </div>
      <div className="flex flex-col w-full min-h-screen space-y-4 lg:space-y-10 lg:ml-10">
        <Badges />
        <SubmissionList userId={id!} />
        <CompletedCourseList userId={id!} />
      </div>
    </div>
  );
};
