import { TEditProfileTab } from "../types";
import { User, Bell } from "lucide-react";

export const EDIT_PROFILE_TABS = {
  ACCOUNT: {
    id: "account",
    label: "Account",
    icon: <User size={24} />
  } as TEditProfileTab,
  NOTIFICATIONS: {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={24} />
  } as TEditProfileTab
};
