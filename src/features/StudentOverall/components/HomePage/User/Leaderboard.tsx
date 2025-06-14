import { Separator } from "@/components/ui/Separator";
import { TLeaderboardRank } from "@/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/shadcn";
import { Button, EmptyMessage } from "@/components/ui";
import { ArrowRight } from "lucide-react";

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
      <div
        className="text-sm font-semibold grid grid-cols-[1fr_3fr_1fr] gap-2 cursor-pointer hover:opacity-80"
        onClick={handleItemClick}
      >
        <div
          className={` line-clamp-1 ${
            rank === 1 ? "text-gold" : rank === 2 ? "text-gray3" : rank === 3 ? "text-bronze" : ""
          }`}
        >
          #{rank}
        </div>
        <div
          className={`col-auto text-left truncate ${
            rank === 1 ? "text-gold" : rank === 2 ? "text-gray3" : rank === 3 ? "text-bronze" : ""
          }`}
        >
          {item.displayName}
        </div>
        <div
          className={` text-right line-clamp-1 ${
            rank === 1 ? "text-gold" : rank === 2 ? "text-gray3" : rank === 3 ? "text-bronze" : ""
          }`}
        >
          {item.point}
        </div>
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
    <Card className="p-6 max-h-[300px] overflow-auto border rounded-lg border-gray5">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
        <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/leaderboard")}>
          View all <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <Separator className="my-3" />
      <div>{isLoading ? renderSkeletonLoading() : renderRanks()}</div>
      {leaderboardData.length === 0 && !isLoading && <EmptyMessage message="No leaderboard data available" />}
    </Card>
  );
};
