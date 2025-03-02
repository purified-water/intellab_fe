import { TEditProfileTab } from "../../../types";
import { EDIT_PROFILE_TABS } from "../../../constants/editProfileTabs";
import { SideBarButton } from "./SideBarButton";

type SideBarProps = {
  activeTab: TEditProfileTab;
  setActiveTab: (tab: TEditProfileTab) => void;
};

export function SideBar(props: SideBarProps) {
  const { activeTab, setActiveTab } = props;

  return (
    <div className="w-64">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <ul>
        <SideBarButton tab={EDIT_PROFILE_TABS.ACCOUNT} activeTab={activeTab} setActiveTab={setActiveTab} />
        <SideBarButton tab={EDIT_PROFILE_TABS.NOTIFICATIONS} activeTab={activeTab} setActiveTab={setActiveTab} />
      </ul>
    </div>
  );
}
