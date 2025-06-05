import { EmptyList, Separator } from "@/components/ui";

export const Badges = () => {
  const renderEmpty = () => {
    return <EmptyList message="No badges earned yet. Complete courses and challenges to earn badges!" size="sm" />;
  };

  return (
    <div className="w-full bg-white rounded-[10px] flex flex-col p-6 space-y-3">
      <p className="text-xl font-bold text-appPrimary">Badges</p>
      <Separator className="my-2" />
      {renderEmpty()}
    </div>
  );
};
