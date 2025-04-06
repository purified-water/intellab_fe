import { Info, MessageCircle, Trophy } from "lucide-react";
import { NotificationType } from "../types/NotificationType";

interface NotificationCardProps {
  notification: NotificationType;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { type, user, content, modifiedDate } = notification;
  const icon = {
    comment: <MessageCircle className="size-5 text-appInfo" />,
    achievement: <Trophy className="size-5 text-appMedium" />,
    alert: <Info className="text-appPrimary size-5" />
  }[type];

  return (
    <div className="flex items-center px-4 py-4 border-b last:border-none">
      <div className="mr-3 text-lg">{icon}</div>
      <div className="flex-1 mr-2 text-sm line-clamp-2">
        {user && <span className="font-semibold text-appPrimary">{user} </span>}
        <span className="text-gray2">{content}</span>
      </div>
      <div className="text-sm text-gray3">a month ago</div>
    </div>
  );
};
