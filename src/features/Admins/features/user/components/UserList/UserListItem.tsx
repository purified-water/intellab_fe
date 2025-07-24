import { IUser } from "@/types";
import { Skeleton } from "@/components/ui/shadcn";
import { shortenDate } from "@/utils";
import { NA_VALUE } from "@/constants";
interface UserListItemProps {
  user: IUser;
  loading: boolean;
}

export function UserListItem(props: UserListItemProps) {
  const { user, loading } = props;

  const createPremiumBadge = (text: string, colorClasses: string) => {
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses}`}>{text}</span>;
  };

  const renderUserPremium = (userPremiumType: string | null | undefined) => {
    if (!userPremiumType) {
      return createPremiumBadge(NA_VALUE, "bg-gray-100 text-gray-600");
    }

    switch (userPremiumType.toLowerCase()) {
      case "free":
        return createPremiumBadge("Free", "bg-green-100 text-green-700");
      case "premium_plan":
      case "premium":
        return createPremiumBadge("Premium", "bg-purple-100 text-purple-700");
      default:
        return createPremiumBadge(NA_VALUE, "bg-gray-100 text-gray-600");
    }
  };

  const renderLoading = () => {
    return (
      <tr className="text-base border-b border-gray5">
        <td className="px-2 py-1">
          <Skeleton className="w-32 h-4" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="w-32 h-4" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-28" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-28" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="w-16 h-4" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    return (
      <>
        <tr key={user.userUid} className="text-base border-b border-gray5">
          <td className="px-2 py-2 max-w-[200px] truncate">{user.email}</td>
          <td className="px-2 py-2 max-w-[200px]">{user.displayName}</td>
          <td className="px-2 py-2 max-w-[350px]">{shortenDate(user.creationTimestamp!)}</td>
          <td className="px-2 py-2 max-w-[350px]">{shortenDate(user.lastSignInTimestamp!)}</td>
          <td className="px-2 py-2 max-w-[100px]">{renderUserPremium(user.premiumType)}</td>
          {/* <td className="px-2 py-1">{renderDropdownMenu()}</td> */}
        </tr>
      </>
    );
  };

  return loading ? renderLoading() : renderContent();
}
