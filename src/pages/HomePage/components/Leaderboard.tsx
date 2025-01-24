import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/Separator";
import { leaderboardAPI } from "@/lib/api";
import { ILeaderboardRank } from "../types/responseTypes";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

export const Leaderboard = () => {
  const [ranks, setRanks] = useState<ILeaderboardRank[]>();
  const [loading, setLoading] = useState(false);

  const getLeaderboard = async () => {
    setLoading(true);
    const data = await leaderboardAPI.getLeaderboard();
    setRanks(data.content);
    setLoading(false);
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  const LeaderboardItem = ({ rank, username, score }: { rank: number; username: string; score: number }) => {
    return (
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-2">
        <div className="text-base font-normal line-clamp-1">#{rank}</div>
        <div className="col-auto text-base font-normal text-left line-clamp-1">{username}</div>
        <div className="text-base font-normal text-right line-clamp-1">{score}</div>
      </div>
    );
  };

  const renderRanks = () => {
    return ranks?.map((rank, index) => (
      <LeaderboardItem key={index} rank={rank.rank} username={rank.name} score={rank.score} />
    ));
  };

  const renderSkeletonLoading = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="gap-2 mt-2">
        <Skeleton className="h-6" />
      </div>
    ));
  };

  return (
    <div className="p-4 border border-gray5 rounded-lg">
      <div className="text-xl font-bold text-appPrimary">Leaderboard</div>
      <Separator className="my-2" />
      <div>{loading ? renderSkeletonLoading() : renderRanks()}</div>
      <div className="flex justify-center mt-3">
        <a href="#" className="self-center font-bold text-appPrimary">
          View more...
        </a>
      </div>
    </div>
  );
};
