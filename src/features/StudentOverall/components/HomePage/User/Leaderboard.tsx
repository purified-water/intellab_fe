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
        className="my-[3px] text-[15px] font-medium grid grid-cols-[1fr_3fr_2fr] gap-2 cursor-pointer hover:opacity-80"
        onClick={handleItemClick}
      >
        <div
          className={`line-clamp-1 ${
            rank === 1 ? "text-gold" : rank === 2 ? "text-gray2" : rank === 3 ? "text-bronze" : "text-muted-foreground"
          }`}
        >
          {rank}
        </div>
        <div
          className={`col-auto text-left truncate ${
            rank === 1 ? "text-gold" : rank === 2 ? "text-gray2" : rank === 3 ? "text-bronze" : "text-muted-foreground"
          }`}
        >
          {item.displayName}
        </div>
        <div
          className={` text-right line-clamp-1 ${
            rank === 1 ? "text-gold" : rank === 2 ? "text-gray2" : rank === 3 ? "text-bronze" : "text-muted-foreground"
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
      <div className="flex items-center justify-between mb-6">
        <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
        <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/leaderboard")}>
          View all <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div>{isLoading ? renderSkeletonLoading() : renderRanks()}</div>
      {leaderboardData.length === 0 && !isLoading && <EmptyMessage message="No leaderboard data available" />}
    </Card>
  );
};
