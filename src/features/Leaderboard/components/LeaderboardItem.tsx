import { TRank } from "../types";
import { useNavigate } from "react-router-dom";

type LeaderboardItemProps = {
  item: TRank;
};

export function LeaderboardItem(props: LeaderboardItemProps) {
  const { item } = props;
  const { user, points, rank } = item;

  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/profile/${user.userId}`);
  };

  return (
    <div
      className="flex items-center justify-between py-2 border-b border-gray-200 cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="flex items-center space-x-3">
        <span className="text-gray-600">{rank}</span>
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-sm">👤</span>
        </div>
        <span className="text-gray-800">{user.displayName}</span>
      </div>
      <span className="text-gray-800">{points} points</span>
    </div>
  );
}
