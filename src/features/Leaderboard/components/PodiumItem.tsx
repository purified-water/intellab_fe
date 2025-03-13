import { TRank } from "../types";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import clsx from "clsx";

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
      <div className={clsx("shadow-sm", `shadow-${color}`, "w-[300px]", "rounded-lg", "space-y-4")}>
        <div className="py-2 justify-items-center" style={{ height }}>
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-24 h-4 mt-2" />
          <Skeleton className="w-32 h-3 mt-1" />
        </div>
        <div className={clsx(`bg-${color}`, "text-white", "text-center", "py-2", "px-4", "rounded-b-lg")}>
          <Skeleton className="h-6 mx-auto w-28" />
        </div>
      </div>
    );
  };

  const renderAvatar = () => {
    let image = DEFAULT_AVATAR;
    if (user.photoUrl) {
      image = user.photoUrl;
    }
    return <img className="w-12 h-12 rounded-full" src={image} alt="avatar" />;
  };

  const renderContent = () => {
    return (
      <div
        className={clsx(
          "shadow-md",
          `${color === "gold" ? "shadow-gold" : color === "bronze" ? "shadow-bronze" : "shadow-gray3"}`,
          "w-[300px]",
          "rounded-lg",
          "space-y-4",
          "cursor-pointer",
          "hover:bg-gray6"
        )}
        onClick={handleItemClick}
      >
        <div className="py-2 justify-items-center" style={{ height }}>
          {renderAvatar()}
          <h3 className="text-base font-semibold text-gray-800">{user.displayName}</h3>
          <p className="text-sm text-gray-500">{`${user.firstName} ${user.lastName}`}</p>
        </div>
        <div className={clsx(`${color === "gold" ? "bg-gold" : color === "bronze" ? "bg-bronze" : "bg-gray3"}`, "text-white", "text-center", "py-2", "px-4", "rounded-b-lg")}>
          {points} Points
        </div>
      </div>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
