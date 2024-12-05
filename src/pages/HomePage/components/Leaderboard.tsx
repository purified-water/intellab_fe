import { Separator } from "@/components/ui/Separator";

export const Leaderboard = () => {
  const LeaderboardItem = ({ rank, username, score }: { rank: number; username: string; score: number }) => {
    return (
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-2">
        <div className="text-base font-normal line-clamp-1">#{rank}</div>
        <div className="col-auto text-base font-normal text-left line-clamp-1">{username}</div>
        <div className="text-base font-normal text-right line-clamp-1">{score}</div>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-xl font-bold text-appPrimary">Leaderboard</div>

      <Separator className="my-2" />

      <div>
        <LeaderboardItem rank={1} username="John Doe" score={100} />
        <LeaderboardItem rank={2} username="Jane Doe" score={90} />
        <LeaderboardItem rank={3} username="John Smith Super" score={80} />
      </div>

      <div className="flex justify-center mt-3">
        <a href="#" className="self-center font-bold text-appPrimary">
          View more...
        </a>
      </div>
    </div>
  );
};
