import React from "react";
import "./App.css";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { SignUpPage } from "@/features/Auth/pages/SignUpPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { ProblemsPage } from "@/pages/ProblemsPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { ExplorePage } from "@/pages/ExplorePage/ExplorePage";
import SectionDetailPage from "@/pages/ExplorePage/SectionDetailPage";
import { ProfilePage } from "@/features/Profile/pages/ProfilePage";
import { PremiumPage } from "@/features/Premium/PremiumPage";

// Layout component to include Navbar
const Layout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Renders the current route's component */}
  </>
);

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wrap routes with Layout
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/explore",
        element: <ExplorePage />
      },
      {
        path: "explore/:section",
        element: <SectionDetailPage />
      },
      {
        path: "/problems",
        element: <ProblemsPage />
      },
      {
        path: "/community",
        element: <CommunityPage />
      },
      {
        path: "/premium",
        element: <PremiumPage />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/signup",
        element: <SignUpPage />
      },
      {
        path: "/profile",
        element: <ProfilePage />
      }
    ]
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
