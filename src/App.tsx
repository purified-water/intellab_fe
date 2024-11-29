import React from "react";
import "./App.css";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { SignUpPage } from "@/features/Auth/pages/SignUpPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { ExplorePage } from "@/pages/ExplorePage";
import { ProblemsPage } from "@/pages/ProblemsPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { CourseDetailPage } from "@/features/Course/pages";

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
        path: "/problems",
        element: <ProblemsPage />
      },
      {
        path: "/community",
        element: <CommunityPage />
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
