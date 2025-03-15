import { useEffect, useState } from "react";
import { PodiumItem } from "./PodiumItem";
import { TLeaderboardRank } from "@/types";
import { leaderboardAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

export function PodiumList() {
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TLeaderboardRank[]>([]);

  const getLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard("all", 0, 3);
      if (response) {
        setData(response.content);
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

  const renderSkeleton = () => {
    const placeHolder = [1, 2, 3];
    return placeHolder.map((_, index) => <PodiumItem key={index} item={null} loading={true} />);
  };

  const renderContent = () => {
    return (
      <>
        <PodiumItem item={data[1]} height={110} loading={loading} />
        <PodiumItem item={data[0]} color="gold" height={130} loading={loading} />
        <PodiumItem item={data[2]} color="bronze" loading={loading} />
      </>
    );
  };

  return (
    <div className="flex items-end justify-between space-x-7 w-full">
      {loading ? renderSkeleton() : renderContent()}
    </div>
  );
}
