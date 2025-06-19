import { UserHomePage } from "../components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AIOrb } from "@/features/MainChatBot/components/AIOrb";
import { SEO } from "@/components/SEO";
import GuestHomePage from "../components/HomePage/Guest/GuestHomePage";
import { Suspense } from "react";
import { Spinner } from "@/components/ui";
import React from "react";
const AppFooter = React.lazy(() => import("@/components/AppFooter").then((module) => ({ default: module.AppFooter })));

export const HomePage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO title="Intellab - AI-Powered Programming Learning Platform" />
      {isAuthenticated ? <UserHomePage /> : <GuestHomePage />}
      {isAuthenticated && <AIOrb />}
      <Suspense fallback={<Spinner className="size-6" loading />}>
        <AppFooter />
      </Suspense>
    </div>
  );
};
