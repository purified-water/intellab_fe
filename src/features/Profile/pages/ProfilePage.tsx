import {
  ProfileSection,
  StatsSection,
  LanguagesSection,
  LevelsSection,
  Badges,
  Courses,
  Submissions
} from "@/features/Profile/components";

export const ProfilePage = () => {
  return (
    <div className="flex flex-col items-start justify-between min-h-screen px-10 pt-10 bg-gray5 lg:flex-row">
      <div className="flex flex-col items-start p-4 sm:p-10 w-full lg:w-[470px] h-auto lg:h-[1100px] mb-10 lg:mb-20 bg-white rounded-[10px]">
        <ProfileSection />
        <StatsSection />
        <LanguagesSection />
        <LevelsSection />
      </div>
      <div className="flex flex-col w-full min-h-screen space-y-4 lg:space-y-10 lg:ml-10">
        <Badges></Badges>
        <Courses></Courses>
        <Submissions></Submissions>
      </div>
    </div>
  );
};
