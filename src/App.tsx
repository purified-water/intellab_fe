import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { Toaster } from "@/components/ui/shadcn/toaster";
// Importing route configurations
import AuthRoute from "./features/Auth/route";
import CertificateRoute from "./features/Certificate/route";
import CourseRoute from "./features/Course/route";
import LeaderboardRoute from "./features/Leaderboard/route";
import LessonRoute from "./features/Lesson/route";
import PaymentRoute from "./features/Payment/route";
import ProfileRoute from "./features/Profile/route";
import QuizRoute from "./features/Quiz/route";
import ProblemRoute from "./features/Problem/route";
import StudentOverallRoute from "./features/StudentOverall/route";
import NotificationRoute from "./features/Notification/route";
import { TooltipProvider } from "@/components/ui/shadcn/tooltip";
import { useNotificationSocket } from "@/hooks";
import AdminRoute from "./features/Admins/route";
import { AdminLayout } from "./features/Admins/AdminLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

// Layout component to include conditional Navbar
import { useState, useEffect } from "react";
import { VerifyAccountBanner } from "./components/VerifyAccountBanner";
import { ScrollToTop } from "./hooks/useScrollToTop";
import { NotFoundPage, ServerErrorPage } from "./features/ErrorPages/pages";

const queryClient = new QueryClient(); // Define outside of the component to avoid re-creating it on every render

export const Layout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup", "/forgot-password", "/profile/reset-password"].includes(location.pathname);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {/* Force when navigating to new page, scroll to top */}
      <ScrollToTop />
      <VerifyAccountBanner />
      {!hideNavbar && <Navbar isDarkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />}
      <Outlet />
    </>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ServerErrorPage />,
    children: [
      ...StudentOverallRoute, // The index page "HomePage" is included in here
      ...AuthRoute,
      ...CertificateRoute,
      ...CourseRoute,
      ...LeaderboardRoute,
      ...LessonRoute,
      ...PaymentRoute,
      ...ProfileRoute,
      ...QuizRoute,
      ...ProblemRoute,
      ...NotificationRoute,
      { path: "*", element: <NotFoundPage /> }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [...AdminRoute, { path: "*", element: <NotFoundPage /> }]
  }
]);

function App() {
  // Initialize notification socket
  useNotificationSocket();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HelmetProvider>
            <RouterProvider router={router} />
            <Toaster />
          </HelmetProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
