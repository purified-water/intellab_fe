import { TLeaderboardRank } from "@/types";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import clsx from "clsx";
import useWindowDimensions from "@/hooks/use-window-dimensions";

type PodiumItemProps = {
  item: TLeaderboardRank | null;
  color?: string;
  height?: number;
  loading: boolean;
};

export function PodiumItem(props: PodiumItemProps) {
  const { item, color = "gray3", height = 90, loading } = props;

  if (!item) return null;

  const navigate = useNavigate();
  const width = useWindowDimensions().width;

  const handleItemClick = () => {
    navigate(`/profile/${item?.userUid}`);
  };

  const renderSkeleton = () => {
    return (
      <div className={clsx("shadow-gray5", "w-[400px]", "rounded-lg", "space-y-8")}>
        <div className="py-2 space-y-1 justify-items-center" style={{ height }}>
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-24 h-4 mt-2" />
          <Skeleton className="w-32 h-3 mt-1" />
        </div>
        <div className={clsx("bg-gray5", "text-white", "text-center", "py-2", "px-4", "rounded-b-lg")}>
          <Skeleton className="h-6 mx-auto w-28" />
        </div>
      </div>
    );
  };

  const renderAvatar = () => {
    let image = DEFAULT_AVATAR;
    if (item?.photoUrl) {
      image = item?.photoUrl;
    }
    return (
      <img
        className="object-cover w-12 h-12 border rounded-full border-muted"
        src={image || DEFAULT_AVATAR}
        alt="avatar"
        onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
      />
    );
  };

  const renderContent = () => {
    return (
      <div
        className={clsx("w-[400px]", "rounded-lg", "space-y-8", "cursor-pointer", "shadow-md")}
        onClick={handleItemClick}
      >
        <div className="py-2 space-y-1 justify-items-center" style={{ height }}>
          {renderAvatar()}
          <h3 className="text-base font-semibold truncate text-gray2" style={{ maxWidth: width / 10 }}>
            {item?.displayName}
          </h3>
          <p
            className="text-sm text-gray-500 truncate"
            style={{ maxWidth: width / 6 }}
          >{`${item?.firstName} ${item?.lastName.slice(0, 10)}`}</p>
        </div>
        <div
          className={clsx(
            `${color === "gold" ? "bg-gold" : color === "bronze" ? "bg-bronze" : "bg-gray3"}`,
            "text-white",
            "text-center",
            "py-2",
            "px-4",
            "rounded-b-lg",
            "font-semibold",
            "shadow-md"
          )}
        >
          {item?.point} Points
        </div>
      </div>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
