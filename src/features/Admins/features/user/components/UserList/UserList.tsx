import { IUser } from "@/types";
import { ListFilter, Funnel } from "lucide-react";
import { UserListItem } from "./UserListItem";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { userAPI } from "@/lib/api";
import { showToastError } from "@/utils";
import { Pagination } from "@/components/ui";

const TABLE_HEADERS = [
  { key: "ID", label: "ID", icon: <ListFilter className="h-4 w-4" /> },
  { key: "EMAIL_ADDRESS", label: "Email Address", icon: <ListFilter className="h-4 w-4" /> },
  { key: "USER_NAME", label: "Username", icon: <ListFilter className="h-4 w-4" /> },
  { key: "CREATED", label: "Created", icon: <ListFilter className="h-4 w-4" /> },
  { key: "LAST_LOGIN", label: "Last Login", icon: <ListFilter className="h-4 w-4" /> },
  { key: "TYPE", label: "Type", icon: <Funnel className="h-4 w-4 text-back" /> }
];

interface UserListProps {
  keyword: string;
}

export function UserList(props: UserListProps) {
  const { keyword } = props;
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const toast = useToast();

  const getUserForAdminAPI = async (page: number) => {
    await userAPI.getUsersForAdmin({
      query: { keyword, page },
      onStart: async () => setLoading(true),
      onSuccess: async (response) => {
        setCurrentPage(response.number);
        if (!totalPages) {
          setTotalPages(response.totalPages);
        } else {
          if (response.totalPages == 0) {
            setTotalPages(null);
          } else if (response.totalPages != totalPages) {
            setTotalPages(response.totalPages);
          }
        }
        setUsers(response.content);
      },
      onFail: async (error) => showToastError({ toast: toast.toast, message: error }),
      onEnd: async () => setLoading(false)
    });
  };

  useEffect(() => {
    getUserForAdminAPI(currentPage);
  }, [keyword]);

  const renderHeader = () => (
    <thead>
      <tr className="border-b border-gray5">
        {TABLE_HEADERS.map(({ key, label, icon }) => (
          <th key={key} className={`text-left font-medium text-base border-t py-3 px-2 `}>
            <div className={`flex items-center gap-2`}>
              {label}
              {icon}
            </div>
          </th>
        ))}
        <th className="text-left font-medium text-base border-t" />
      </tr>
    </thead>
  );

  const renderEmpty = () => {
    return (
      <tr className="text-base font-normal text-gray3">
        <td colSpan={8} className="py-5 text-center">
          No courses found
        </td>
      </tr>
    );
  };

  const renderLoading = () => {
    const placeHolder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return placeHolder.map((_, index) => <UserListItem key={index} user={{} as IUser} loading={true} />);
  };

  const renderItems = () => {
    return users.map((user) => <UserListItem key={user.userUid} user={user} loading={false} />);
  };

  const renderBody = () => {
    let content = null;
    if (loading) {
      content = renderLoading();
    } else if (users.length === 0) {
      content = renderEmpty();
    } else {
      content = renderItems();
    }

    return <tbody>{content}</tbody>;
  };

  const renderPagination = () => {
    let content = null;
    if (totalPages && totalPages != 0) {
      content = (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => getUserForAdminAPI(page)}
        />
      );
    }

    return content;
  };

  return (
    <>
      <table className="w-full">
        {renderHeader()}
        {renderBody()}
      </table>
      {renderPagination()}
    </>
  );
}
