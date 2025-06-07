import { LeaderboardList, PodiumList } from "../components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { SEO } from "@/components/SEO";

export function LeaderboardPage() {
  const navigate = useNavigate();

  const { width } = useWindowDimensions();

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
    <div className="py-4">
      <SEO title="Leaderboard | Intellab" />
      <div style={{ marginLeft: width / 5, marginRight: width / 5 }}>
        {renderTitle()}
        <div className="space-y-8 justify-items-center">
          <PodiumList />
          <LeaderboardList />
        </div>
      </div>
    </div>
  );
}
