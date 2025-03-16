import { TLeaderboardRank } from "@/types";
import { useNavigate } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { NA_VALUE } from "@/constants";

type LeaderboardItemProps = {
  rank: number;
  item: TLeaderboardRank | null;
  loading: boolean;
  filterValue: string;
};

export function LeaderboardItem(props: LeaderboardItemProps) {
  const { rank, item, loading, filterValue } = props;

  const navigate = useNavigate();

  const renderSkeleton = () => {
    const renderAdditionalColumns = () => {
      let result = null;
      switch (filterValue) {
        case "problem":
          result = (
            <>
              <td className="w-[80px] text-left">
                <Skeleton className="w-16 h-6" />
              </td>
              <td className="w-[80px] text-left">
                <Skeleton className="w-16 h-6" />
              </td>
              <td className="w-[80px] text-left">
                <Skeleton className="w-16 h-6" />
              </td>
            </>
          );
          break;
        case "course":
          result = (
            <>
              <td className="w-[100px] text-left">
                <Skeleton className="w-16 h-6" />
              </td>
              <td className="w-[120px] text-left">
                <Skeleton className="w-20 h-6" />
              </td>
              <td className="w-[100px] text-left">
                <Skeleton className="w-16 h-6" />
              </td>
            </>
          );
          break;
        default:
          // all
          result = null;
          break;
      }
      return result;
    };

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
        <td className="w-[100px] text-left">
          <Skeleton className="w-16 h-6" />
        </td>
        {renderAdditionalColumns()}
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

    const renderAdditionalColumns = () => {
      let result = null;
      switch (filterValue) {
        case "problem":
          result = (
            <>
              <td className="w-[80px] text-left">{item?.problemStat ? item?.problemStat.easy : NA_VALUE}</td>
              <td className="w-[80px] text-left">{item?.problemStat ? item?.problemStat.medium : NA_VALUE}</td>
              <td className="w-[80px] text-left">{item?.problemStat ? item?.problemStat.hard : NA_VALUE}</td>
            </>
          );
          break;
        case "course":
          result = (
            <>
              <td className="w-[100px] text-left">{item?.courseStat ? item?.courseStat.beginner : NA_VALUE}</td>
              <td className="w-[120px] text-left">{item?.courseStat ? item?.courseStat.intermediate : NA_VALUE}</td>
              <td className="w-[100px] text-left">{item?.courseStat ? item?.courseStat.advanced : NA_VALUE}</td>
            </>
          );
          break;
        default:
          // all
          result = null;
          break;
      }
      return result;
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
        <td className="w-[120px] text-left">{item?.point} points</td>
        {renderAdditionalColumns()}
      </tr>
    );
  };

  return loading ? renderSkeleton() : renderContent();
}
