import { MessageCircle, Trophy, Info } from "lucide-react";
import { NotificationRedirectTypes } from "../constants/NotificationRedirectTypes";

const commentTypes = [NotificationRedirectTypes.PROBLEM_COMMENT, NotificationRedirectTypes.COURSE_COMMENT];

const achievementTypes = [
  NotificationRedirectTypes.COURSE_REVIEW,
  NotificationRedirectTypes.COURSE_COMPLETE,
  NotificationRedirectTypes.SOLVED_PROBLEM
];

const iconMap = new Map<string, JSX.Element>();
commentTypes.forEach((type) => iconMap.set(type, <MessageCircle className="size-5 text-appInfo" />));
achievementTypes.forEach((type) => iconMap.set(type, <Trophy className="size-5 text-appMedium" />));

export const defaultNotificationIcon = <Info className="text-appPrimary size-5" />;

export const getNotificationIcon = (type: string): JSX.Element => iconMap.get(type) ?? defaultNotificationIcon;
