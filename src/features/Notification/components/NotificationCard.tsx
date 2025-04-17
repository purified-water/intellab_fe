import { NotificationType } from "../types/NotificationType";
import { formatDateInProblem } from "@/utils";
import { getNotificationIcon } from "./NotificationIcon";
import { renderMessageWithUser } from "../utils/renderNotificationMessage";
import { useNavigate } from "react-router-dom";
import { notificationAPI } from "@/lib/api/notificationAPI";
import { useDispatch } from "react-redux";
import { markOneAsRead } from "@/redux/notifications/notificationsSlice";
import { NotificationRedirectTypes } from "../constants/NotificationRedirectTypes";
interface NotificationCardProps {
  type: string;
  notification: NotificationType;
}

export const NotificationCard = ({ type, notification }: NotificationCardProps) => {
  const icon = getNotificationIcon(notification.redirectType);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNotificationClick = async () => {
    if (!notification.markAsRead) {
      try {
        await notificationAPI.putMarkOneAsRead(notification.id).then(() => {
          dispatch(markOneAsRead(notification.id));
        });
        console.log("Notification marked as read:", notification.id);
      } catch (error) {
        console.log("Error marking notification as read:", error);
      }
    }
    if (!notification.redirectType) {
      return;
    }

    //   if (notification.redirectType === NotificationRedirectTypes.COURSE_COMMENT || notification.redirectType === NotificationRedirectTypes.COURSE_REVIEW) {
    //     navigate(notification.redirectContent);
    //   }
  };

  if (type === "menu") {
    return (
      <div
        key={notification.id}
        onClick={handleNotificationClick}
        className={`flex items-center px-6 py-4 space-x-2 transition-colors duration-300 border-b cursor-pointer last:border-none hover:bg-gray6 ${!notification.markAsRead ? "font-semibold" : ""}`}
      >
        <div className="mr-3 text-lg">{icon}</div>
        <div className="flex-1 mr-2 text-sm line-clamp-2">
          <span className="text-gray2">
            {notification.title} {renderMessageWithUser(notification.message)}
          </span>
        </div>
        <div className="text-sm text-gray3">{formatDateInProblem(new Date(notification.timestamp).toISOString())}</div>
      </div>
    );
  }

  return (
    <div
      key={notification.id}
      onClick={handleNotificationClick}
      className="flex items-center px-6 py-4 space-x-2 transition-colors duration-300 border-b cursor-pointer last:border-none"
    >
      <div className="mr-3 [&_svg]:size-6">{icon}</div>
      <div className="flex flex-col space-y-1">
        <span className="font-semibold text-gray2">{notification.title}</span>
        <div className="flex-1 mr-2 text-sm font-normal line-clamp-2">
          {renderMessageWithUser(notification.message)}
        </div>
        <div className="text-sm font-normal text-gray3">
          {formatDateInProblem(new Date(notification.timestamp).toISOString())}
        </div>
      </div>
    </div>
  );
};
