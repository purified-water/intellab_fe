import { TLeaderboardRank } from "@/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/shadcn";
import { EmptyMessage } from "@/components/ui";
import { ArrowRight, Crown } from "lucide-react";

interface LeaderboardProps {
  leaderboardData: TLeaderboardRank[];
  isLoading?: boolean;
}

export const Leaderboard = ({ leaderboardData, isLoading }: LeaderboardProps) => {
  const navigate = useNavigate();

  const LeaderboardItem = ({ rank, item }: { rank: number; item: TLeaderboardRank }) => {
    const handleItemClick = () => navigate(`/profile/${item.userUid}`);

    const getRankClass = () => {
      switch (rank) {
        case 1:
          return "text-gold font-bold";
        case 2:
          return "text-gray2 font-bold";
        case 3:
          return "text-bronze font-bold";
        default:
          return "text-gray3";
      }
    };

    const renderCrownIcon = () => {
      if (rank === 1) return <Crown className="w-4 h-4 text-gold" />;
      if (rank === 2) return <Crown className="w-4 h-4 text-gray2" />;
      if (rank === 3) return <Crown className="w-4 h-4 text-bronze" />;
      return null;
    };

    return (
      <div
        className="my-[3px] text-[15px] font-medium grid grid-cols-[1fr_3fr_2fr] gap-2 cursor-pointer hover:opacity-80 items-center"
        onClick={handleItemClick}
      >
        <div className="flex items-center gap-1">
          <span className={`line-clamp-1 ${getRankClass()}`}>{rank}</span>
          {renderCrownIcon()}
        </div>
        <div className={`col-auto text-left truncate ${getRankClass()}`}>{item.displayName}</div>
        <div className={`text-right line-clamp-1 ${getRankClass()}`}>{item.point}</div>
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
        <button type="button" className="flex gap-1 text-xs font-medium" onClick={() => navigate("/leaderboard")}>
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div>{isLoading ? renderSkeletonLoading() : renderRanks()}</div>
      {leaderboardData.length === 0 && !isLoading && <EmptyMessage message="No leaderboard data available" />}
    </Card>
  );
};
