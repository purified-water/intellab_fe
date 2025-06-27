import { EmptyList, Separator, Skeleton } from "@/components/ui";
import { Badge } from "@/types";

interface BadgesProps {
  badges: Badge[];
  isLoading?: boolean;
}

export const Badges = ({ badges, isLoading }: BadgesProps) => {
  const renderEmpty = () => {
    return <EmptyList message="No badges earned yet. Complete courses and challenges to earn badges!" size="sm" />;
  };

  const renderSkeleton = () => {
    return (
      <div className="flex flex-row flex-wrap items-center justify-start">
        <Skeleton className="h-20 lg:h-[80px] xl:h-24 rounded-full" />
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <p className="text-xl font-bold text-appPrimary">Badges</p>
      <Separator className="my-2" />
      {isLoading ? (
        renderSkeleton()
      ) : badges && badges.length === 0 ? (
        renderEmpty()
      ) : (
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
      )}
    </div>
  );
};
