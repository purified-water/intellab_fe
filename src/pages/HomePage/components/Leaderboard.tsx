import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/Separator";
import { leaderboardAPI } from "@/lib/api";
import { TLeaderboardRank } from "@/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { useNavigate } from "react-router-dom";

export const Leaderboard = () => {
  const [ranks, setRanks] = useState<TLeaderboardRank[]>();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const getLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard("all", 0, 3);
      if (response) {
        setRanks(response.content);
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "An error occurred while fetching leaderboard data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

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
    return ranks?.map((rank, index) => <LeaderboardItem key={index} rank={index + 1} item={rank} />);
  };

  const renderSkeletonLoading = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="gap-2 mt-2">
        <Skeleton className="h-6" />
      </div>
    ));
  };

  return (
    <div className="p-4 border rounded-lg border-gray5">
      <div className="text-xl font-bold text-appPrimary">Leaderboard</div>
      <Separator className="my-2" />
      <div>{loading ? renderSkeletonLoading() : renderRanks()}</div>
      <div className="flex justify-center mt-3">
        <a href="/leaderboard" className="self-center font-bold text-appPrimary">
          View more...
        </a>
      </div>
    </div>
  );
};
