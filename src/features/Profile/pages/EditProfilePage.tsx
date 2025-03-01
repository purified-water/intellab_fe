import { useState } from "react";
import { SideBar, EditProfileSection, NotificationSection } from "../components/EditProfile";

export function EditProfilePage() {
  const [activeTab, setActiveTab] = useState("account"); // Mặc định là 'account'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">{activeTab === "account" ? <EditProfileSection /> : <NotificationSection />}</div>
    </div>
  );
}
