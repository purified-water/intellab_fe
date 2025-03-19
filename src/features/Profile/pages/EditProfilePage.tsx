import { useState, useEffect } from "react";
import { SideBar, EditProfileSection, NotificationSection } from "../components/EditProfile";
import { TEditProfileTab } from "../types";
import { EDIT_PROFILE_TABS } from "../constants/editProfileTabs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";

export function EditProfilePage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TEditProfileTab>(EDIT_PROFILE_TABS.ACCOUNT);

  useEffect(() => {
    document.title = "Edit Profile | Intellab";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex justify-center min-h-screen py-8 space-x-4 bg-gray6">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-[800px] mt-3">
        {activeTab === EDIT_PROFILE_TABS.ACCOUNT ? <EditProfileSection /> : <NotificationSection />}
      </div>
    </div>
  );
}
