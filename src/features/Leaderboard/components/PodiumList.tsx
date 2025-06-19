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

  const getLeaderboardAPI = async () => {
    await leaderboardAPI.getLeaderboard({
      query: {
        filter: "all",
        page: 0,
        size: 3
      },
      onStart: async () => setLoading(true),
      onSuccess: async (response) => setData(response.content),
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  useEffect(() => {
    getLeaderboardAPI();
  }, []);

  const renderSkeleton = () => {
    const placeHolder = [1, 2, 3];
    return placeHolder.map((_, index) => <PodiumItem key={index} item={null} loading={true} />);
  };

  const renderContent = () => {
    return (
      <>
        <PodiumItem item={data[1]} height={130} loading={loading} />
        <PodiumItem item={data[0]} color="gold" height={130} loading={loading} />
        <PodiumItem item={data[2]} color="bronze" height={130} loading={loading} />
      </>
    );
  };

  return (
    <div className="flex items-end justify-center w-full space-x-7">{loading ? renderSkeleton() : renderContent()}</div>
  );
}
