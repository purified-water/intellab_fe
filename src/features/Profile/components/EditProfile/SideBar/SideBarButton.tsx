import { TEditProfileTab } from "@/features/Profile/types";

type SideBarButtonProps = {
  tab: TEditProfileTab;
  activeTab: TEditProfileTab;
  setActiveTab: (tab: TEditProfileTab) => void;
};

export const SideBarButton = ({ tab, activeTab, setActiveTab }: SideBarButtonProps) => (
  <li className="mb-2">
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex w-full text-left font-bold p-3 rounded-lg ${activeTab === tab ? null : "text-gray3"} ${activeTab === tab ? "bg-gray7" : null}`}
    >
      <span className="mr-2">{tab.icon}</span> {tab.label}
    </button>
  </li>
);
