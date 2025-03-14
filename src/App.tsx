import React from "react";
import "./App.css";
import { HomePage } from "@/pages/HomePage/pages/HomePage";
import { LoginPage } from "@/features/Auth/pages/LoginPage";
import { SignUpPage } from "@/features/Auth/pages/SignUpPage";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import { ProblemsPage } from "@/pages/ProblemsPage/pages/ProblemsPage";
import { CommunityPage } from "@/pages/CommunityPage";
import { CourseDetailPage } from "@/features/Course/pages";
import { ExplorePage } from "@/pages/ExplorePage/ExplorePage";
import SectionDetailPage from "@/pages/ExplorePage/SectionDetailPage";
import { ProfilePage, EditProfilePage, ViewAllSubmissionPage } from "@/features/Profile/pages";
import { PricingPage } from "@/features/Pricing/PricingPage";
import { LessonDetailPage } from "@/features/Lesson/pages/LessonDetailPage";
import { ProblemDetail } from "@/features/Problem/pages/ProblemDetailPage";
import { LessonQuiz } from "./features/Quiz/pages/LessonQuiz";
import { Toaster } from "@/components/ui/shadcn/toaster";
import { CertificatePage } from "./features/Certificate/pages";
import { PaymentStatusPage } from "./features/Payment/pages";
import { LeaderboardPage } from "./features/Leaderboard/pages/LeaderboardPage";

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
        path: "/problems/:problemId",
        element: <ProblemDetail />
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
        path: "/profile/:id",
        element: <ProfilePage />
      },
      {
        path: "/lesson/:id",
        element: <LessonDetailPage />
      },
      {
        path: "/course/:id",
        element: <CourseDetailPage />
      },
      {
        path: "/lesson/:lessonId/quiz/:quizId",
        element: <LessonQuiz />
      },
      {
        path: "/certificate/:id",
        element: <CertificatePage />
      },
      {
        path: "/profile/edit",
        element: <EditProfilePage />
      },
      {
        path: "/profile/submissions",
        element: <ViewAllSubmissionPage />
      },
      {
        path: "/payment/status",
        element: <PaymentStatusPage />
      },
      {
        path: "/leaderboard",
        element: <LeaderboardPage />
      }
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
