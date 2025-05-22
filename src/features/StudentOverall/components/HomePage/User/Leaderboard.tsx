import { Separator } from "@/components/ui/Separator";
import { TLeaderboardRank } from "@/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/shadcn";
import { EmptyMessage } from "@/components/ui";

interface LeaderboardProps {
  leaderboardData: TLeaderboardRank[];
  isLoading?: boolean;
}

export const Leaderboard = ({ leaderboardData, isLoading }: LeaderboardProps) => {
  const navigate = useNavigate();

  const LeaderboardItem = ({ rank, item }: { rank: number; item: TLeaderboardRank }) => {
    const handleItemClick = () => {
      navigate(`/profile/${item.userUid}`);
    };

    return (
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-2 cursor-pointer hover:opacity-80" onClick={handleItemClick}>
        <div className="text-base font-normal line-clamp-1">#{rank}</div>
        <div className="col-auto text-base font-normal text-left truncate">{item.displayName}</div>
        <div className="text-base font-normal text-right line-clamp-1">{item.point}</div>
      </div>
    );
  };

  const renderRanks = () => {
    return leaderboardData?.map((rank, index) => <LeaderboardItem key={index} rank={index + 1} item={rank} />);
  };

  const renderSkeletonLoading = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="gap-2 mt-2">
        <Skeleton className="h-6" />
      </div>
    ));
  };

  return (
    <Card className="p-4 max-h-[300px] overflow-auto border rounded-lg border-gray5">
      <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
      <Separator className="my-2" />
      <div>{isLoading ? renderSkeletonLoading() : renderRanks()}</div>
      {leaderboardData.length === 0 && !isLoading && <EmptyMessage message="No leaderboard data available" />}
      <div className="flex justify-center mt-3">
        <a href="/leaderboard" className="self-center font-bold text-appPrimary">
          View more...
        </a>
      </div>
    </Card>
  );
};
