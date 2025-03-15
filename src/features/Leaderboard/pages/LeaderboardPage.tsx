import { useEffect } from "react";
import { LeaderboardList, PodiumList } from "../components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LeaderboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Leaderboard | Intellab";
  }, []);

  const onLeaderboardClick = () => {
    navigate("/");
  };

  const renderTitle = () => {
    return (
      <div className="flex items-center mb-6 cursor-pointer" onClick={onLeaderboardClick}>
        <ChevronLeft className="w-6 h-6 mr-2 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="mx-auto">
        {renderTitle()}
        <div className="space-y-8 justify-items-center">
          <PodiumList />
          <LeaderboardList />
        </div>
      </div>
    </div>
  );
}
