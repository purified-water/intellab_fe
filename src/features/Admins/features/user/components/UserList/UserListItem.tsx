import { IUser } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/shadcn";
import { shortenDate } from "@/utils";

const DROP_DOWN_MENU_ITEMS = {
  VIEW: "View",
  MODIFY: "Modify",
  DELETE: "Delete"
};

interface UserListItemProps {
  user: IUser;
  loading: boolean;
}

export function UserListItem(props: UserListItemProps) {
  const { user, loading } = props;

  const handleViewDetails = () => {
    console.log("--> handleViewDetails called for user:", user);
  };

  const handleEditUser = () => {
    console.log("--> handleEditUser called for user:", user);
  };

  const handleDeleteUser = () => {
    console.log("--> handleDeleteUser called for user:", user);
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.VIEW:
          handleViewDetails();
          break;
        case DROP_DOWN_MENU_ITEMS.MODIFY:
          handleEditUser();
          break;
        case DROP_DOWN_MENU_ITEMS.DELETE:
          handleDeleteUser();
          break;
        default:
          break;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-24 min-w-[130px] shadow-lg">
          {[DROP_DOWN_MENU_ITEMS.VIEW, DROP_DOWN_MENU_ITEMS.MODIFY, DROP_DOWN_MENU_ITEMS.DELETE].map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleDropdownMenuItemClick(action)}
              className="text-sm py-1.5 px-3 cursor-pointer  focus:bg-gray6"
            >
              {action}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderLoading = () => {
    return (
      <tr className="text-base border-b border-gray5">
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-32" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-32" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-28" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-28" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-4 w-16" />
        </td>
        <td className="px-2 py-1">
          <Skeleton className="h-8 w-8 rounded-full" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    return (
      <>
        <tr key={user.userUid} className="text-base border-b border-gray5">
          <td className="px-2 py-1 max-w-[100px] truncate">{user.userUid}</td>
          <td className="px-2 py-1 max-w-[200px]">{user.email}</td>
          <td className="px-2 py-1 max-w-[200px]">{user.displayName}</td>
          <td className="px-2 py-1 max-w-[350px]">{shortenDate(user.creationTimestamp!)}</td>
          <td className="px-2 py-1 max-w-[350px]">{shortenDate(user.lastSignInTimestamp!)}</td>
          <td className="px-2 py-1 max-w-[100px]">{user.premiumType}</td>
          <td className="px-2 py-1">{renderDropdownMenu()}</td>
        </tr>
      </>
    );
  };

  return loading ? renderLoading() : renderContent();
}
