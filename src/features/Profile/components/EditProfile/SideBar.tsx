type SideBarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function SideBar(props: SideBarProps) {
  const { activeTab, setActiveTab } = props;

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <ul>
        <li className="mb-2">
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full text-left p-2 rounded ${activeTab === "account" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <span className="mr-2">👤</span> Account
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left p-2 rounded ${
              activeTab === "notifications" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="mr-2">🔔</span> Notifications
          </button>
        </li>
      </ul>
    </div>
  );
}
