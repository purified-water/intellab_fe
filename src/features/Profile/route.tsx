import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/Navigation";
import { NotFoundPage } from "../ErrorPages/pages";

const ProfilePage = lazy(() => import("./pages").then((m) => ({ default: m.ProfilePage })));
const EditProfilePage = lazy(() => import("./pages").then((m) => ({ default: m.EditProfilePage })));
const ViewAllSubmissionPage = lazy(() => import("./pages").then((m) => ({ default: m.ViewAllSubmissionPage })));
const EmailVerifiedPage = lazy(() => import("./pages").then((m) => ({ default: m.EmailVerifiedPage })));

const ProfileRoute: RouteObject[] = [
  {
    path: "profile",
    children: [
      { path: ":id", element: <ProfilePage /> },
      {
        path: "edit",
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: "submissions",
        element: (
          <ProtectedRoute>
            <ViewAllSubmissionPage />
          </ProtectedRoute>
        )
      },
      {
        path: "update-access-token",
        element: (
          <ProtectedRoute>
            <EmailVerifiedPage />
          </ProtectedRoute>
        )
      },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
];

export default ProfileRoute;
