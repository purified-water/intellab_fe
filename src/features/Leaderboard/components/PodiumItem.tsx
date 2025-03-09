import { TRank } from "../types";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type PodiumItemProps = {
  item: TRank;
  color?: string;
  height?: number;
  loading: boolean;
};

export function PodiumItem(props: PodiumItemProps) {
  const { item, color = "gray3", height = 90, loading } = props;
  const { user, points } = item;

  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/profile/${user.userId}`);
  };

  const renderSkeleton = () => {
    return (
      <div className={`shadow-sm shadow-${color} w-[300px] rounded-lg space-y-4`}>
        <div className="justify-items-center py-2" style={{ height }}>
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-24 h-4 mt-2" />
          <Skeleton className="w-32 h-3 mt-1" />
        </div>
        <div className={`bg-${color} text-white text-center py-2 px-4 rounded-b-lg`}>
          <Skeleton className="w-28 h-6 mx-auto" />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const renderAvatar = () => {
      let image = DEFAULT_AVATAR;
      if (user.photoUrl) {
        image = user.photoUrl;
      }
      return <img className="w-12 h-12 rounded-full" src={image} alt="avatar" />;
    };

    return (
      <div
        className={`shadow-sm shadow-${color} w-[300px] rounded-lg space-y-4 cursor-pointer hover:bg-gray6`}
        onClick={handleItemClick}
      >
        <div className="justify-items-center py-2" style={{ height }}>
          {renderAvatar()}
          <h3 className="text-sm font-semibold text-gray-800">{user.displayName}</h3>
          <p className="text-xs text-gray-500">{`${user.firstName} ${user.lastName}`}</p>
        </div>
        <div className={`bg-${color} text-white text-center py-2 px-4 rounded-b-lg`}>{points} Points</div>
      </div>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
