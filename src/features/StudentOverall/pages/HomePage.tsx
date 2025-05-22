import { useEffect } from "react";
import { AppFooter } from "@/components/AppFooter";
import { UserHomePage } from "../components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";

import GuestHomePage from "../components/HomePage/Guest/GuestHomePage";

export const HomePage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    document.title = "Home | Intellab";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated ? <UserHomePage /> : <GuestHomePage />}
      {isAuthenticated && <AIOrb />}
      <AppFooter />
    </div>
  );
};
