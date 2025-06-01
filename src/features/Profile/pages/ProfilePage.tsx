import { useParams } from "react-router-dom";
import {
  ProfileSection,
  StatsSection,
  LanguagesSection,
  LevelsSection,
  Badges,
  CompletedCourseList,
  SubmissionList,
  SubscriptionCard
} from "@/features/Profile/components";
import { AppFooter } from "@/components/AppFooter";

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="bg-gray6/50">
      <div className="flex flex-col items-start justify-between min-h-screen px-8 pt-10 sm:px-20 lg:flex-row">
        <div className="flex flex-col space-y-4 items-start w-full lg:w-[470px] h-fit h:full mb-10 lg:mb-20">
          <SubscriptionCard userId={id!} loading={false} />
          <div className="flex flex-col items-start w-full p-6 mb-10 bg-white rounded-lg sm:p-6 h-fit h:full lg:mb-20">
            <ProfileSection userId={id!} />
            <StatsSection userId={id!} />
            <LanguagesSection userId={id!} />
            <LevelsSection userId={id!} />
          </div>
        </div>

        <div className="flex flex-col w-full min-h-screen ml-0 space-y-2 sm:ml-2 lg:space-y-4 lg:ml-4">
          <Badges />
          <SubmissionList userId={id!} />
          <CompletedCourseList userId={id!} />
        </div>
      </div>
      <AppFooter />
    </div>
  );
};
