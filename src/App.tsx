import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { Toaster } from "@/components/ui/shadcn/toaster";

// Every feature has it own route file which contains the related pages and its route configuration
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

// Layout component to include conditional Navbar
import { useState, useEffect } from "react";

export const Layout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);
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
      ...ProblemRoute
    ]
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster />
    </React.StrictMode>
  );
}

export default App;
