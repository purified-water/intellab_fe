import { memo } from "react";
import { EmptyList, Separator, Skeleton } from "@/components/ui";
import { Badge } from "@/types";

interface BadgesProps {
  badges: Badge[];
  isLoading?: boolean;
  isPublic: boolean;
}

export const Badges = memo(function Badges({ badges, isLoading, isPublic }: BadgesProps) {
  const renderEmpty = (message: string) => {
    return <EmptyList message={message} size="sm" />;
  };

  const renderSkeleton = () => {
    return (
      <div className="flex-row flex-wrap items-center justify-start">
        <Skeleton className="size-20 lg:size-[80px] xl:size-24 rounded-full" />
      </div>
    );
  };

  const renderBadges = () => {
    return (
      <div className="flex flex-row flex-wrap items-center justify-start overflow-x-auto gap-y-4 gap-x-8">
        {badges.map((badge, index) => (
          <div key={index} className="shrink-0">
            <img
              src={badge.image}
              alt={badge.name}
              className="h-20 lg:h-[80px] xl:h-24"
              onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
            />
          </div>
        ))}
      </div>
    );
  };

  let content = null;
  if (isLoading) {
    content = renderSkeleton();
  } else if (!isPublic) {
    content = renderEmpty("This is a private profile. Badges are only visible to the user.");
  } else if (badges.length > 0) {
    content = renderBadges();
  } else {
    content = renderEmpty("Study and solve problems to earn badges!");
  }

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <p className="text-xl font-bold text-appPrimary">Badges</p>
      <Separator className="my-2" />
      {content}
    </div>
  );
});
