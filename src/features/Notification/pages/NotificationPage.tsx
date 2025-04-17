import { RootState } from "@/redux/rootReducer";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationCard } from "../components";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { fetchNotifications, markAllAsRead, selectHasUnread } from "@/redux/notifications/notificationsSlice";
import { Pagination } from "@/components/ui";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { notificationAPI } from "@/lib/api/notificationAPI";

export const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use the typed dispatch

  const notifications = useSelector((state: RootState) => state.notifications.list);
  const loading = useSelector((state: RootState) => state.notifications.loading);
  const error = useSelector((state: RootState) => state.notifications.error);

  const hasUnreadNotifications = useSelector(selectHasUnread);

  const currentPage = useSelector((state: RootState) => state.notifications.currentPage);
  const totalPages = useSelector((state: RootState) => state.notifications.totalPages);

  const getNotifications = async (page: number = 0) => {
    try {
      await dispatch(fetchNotifications({ page, size: 10 }));
    } catch (error) {
      console.error("Failed to fetch notifications: ", error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasUnreadNotifications) {
      timer = setTimeout(async () => {
        await notificationAPI.putMarkAllAsRead().then(() => {
          dispatch(markAllAsRead());
        });
      }, 5000);
    }

    return () => clearTimeout(timer); // Clear if closed early
  }, []);

  // Fetch notifications when the component mounts
  useEffect(() => {
    if (notifications.length === 0) {
      getNotifications();
    }
  }, [dispatch]); // Fetch notifications when t

  if (loading) {
    return (
      <div className="container px-8 py-8 mx-auto sm:px-24">
        <h1 className="flex items-center mb-8 text-2xl font-bold cursor-pointer w-fit hover:text-appPrimary">
          <ChevronLeft className="mr-1" />
          Notification
        </h1>
        <div className="flex flex-col space-y-4 w-min-[200px] mx-auto overflow-y-auto sm:justify-normal">
          {/* Skeleton Loader */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center px-6 py-4 space-x-2 border-b cursor-pointer last:border-none">
              <div className="mr-3">
                <Skeleton className="w-6 h-6" />
              </div>
              <div className="flex flex-col w-full space-y-1">
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-3/4 h-3" />
                <Skeleton className="w-1/5 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-8 py-8 mx-auto sm:px-24">
      <h1
        className="flex items-center mb-8 text-2xl font-bold cursor-pointer w-fit hover:text-appPrimary"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1" />
        Notification
      </h1>
      <div className="flex flex-col w-min-[200px] w-[900px] mx-auto overflow-y-auto sm:justify-normal">
        {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
        {notifications.length > 0 ? (
          notifications.map((notif) => <NotificationCard key={notif.id} type="page" notification={notif} />)
        ) : (
          <div className="p-4 text-center text-gray-500">No notification</div>
        )}
      </div>
      {totalPages != 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => getNotifications(page)} />
      )}
    </div>
  );
};
