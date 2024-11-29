import React from "react";
import "./App.css";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { SignUpPage } from "@/features/Auth/pages/SignUpPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { ProblemsPage } from "@/pages/ProblemsPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { CourseDetailPage } from "@/features/Course/pages";
import { ExplorePage } from "@/pages/ExplorePage/ExplorePage";
import SectionDetailPage from "@/pages/ExplorePage/SectionDetailPage";
import { ProfilePage } from "@/features/Profile/pages/ProfilePage";
import { PricingPage } from "@/features/Pricing/PricingPage";

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
        path: "/pricing",
        element: <PricingPage />
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
        path: "/course/:id",
        element: <CourseDetailPage />
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
