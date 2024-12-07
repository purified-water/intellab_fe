import React from "react";
import "./App.css";
import { HomePage } from "@/pages/HomePage/pages/HomePage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { SignUpPage } from "@/features/Auth/pages/SignUpPage";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { ProblemsPage } from "@/pages/ProblemsPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { CourseDetailPage } from "@/features/Course/pages";
import { ExplorePage } from "@/pages/ExplorePage/ExplorePage";
import SectionDetailPage from "@/pages/ExplorePage/SectionDetailPage";
import { ProfilePage } from "@/features/Profile/pages/ProfilePage";
import { PricingPage } from "@/features/Pricing/PricingPage";
import { LessonDetailPage } from "@/features/Lesson/pages/LessonDetailPage";

// Layout component to include conditional Navbar
const Layout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
        path: "/profile",
        element: <ProfilePage />
      },
      {
        path: "/lesson/:id",
        element: <LessonDetailPage />
      },
      {
        path: "/course/:id",
        element: <CourseDetailPage />
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
