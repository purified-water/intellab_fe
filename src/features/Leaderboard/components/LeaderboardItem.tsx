import { TLeaderboardRank } from "@/types";
import { useNavigate } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type LeaderboardItemProps = {
  rank: number;
  item: TLeaderboardRank | null;
  loading: boolean;
};

export function LeaderboardItem(props: LeaderboardItemProps) {
  const { rank, item, loading } = props;

  const navigate = useNavigate();

  const renderSkeleton = () => {
    return (
      <tr className="border-b border-gray5">
        <td className="w-[80px] text-center py-3">
          <Skeleton className="w-16 h-6 mx-auto" />
        </td>
        <td className="text-left pl-12">
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-64 h-6" />
          </div>
        </td>
        <td className="w-1/6 text-left">
          <Skeleton className="w-32 h-6" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    const handleItemClick = () => {
      navigate(`/profile/${item?.userUid}`);
    };

    const renderAvatar = () => {
      let avatar = DEFAULT_AVATAR;
      if (item?.photoUrl) {
        avatar = item?.photoUrl;
      }
      return <img className="w-10 h-10 rounded-full" src={avatar} alt="avatar" />;
    };

    return (
      <tr className="border-b border-gray5 cursor-pointer hover:opacity-80" onClick={handleItemClick}>
        <td className="w-[80px] text-center py-3">{rank}</td>
        <td className="text-left pl-12">
          <div className="flex items-center gap-2">
            {renderAvatar()}
            {item?.displayName}
          </div>
        </td>
        <td className="w-1/6 text-left">{item?.point} points</td>
      </tr>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
