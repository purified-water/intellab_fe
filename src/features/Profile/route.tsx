import { ProtectedRoute } from "@/components/Navigation";
import { ProfilePage, EditProfilePage, ViewAllSubmissionPage, EmailVerifiedPage } from "./pages";
import { RouteObject } from "react-router-dom";

const ProfileRoute: RouteObject[] = [
  {
    path: "/profile/:id",
    element: <ProfilePage />
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile/submissions",
    element: <ViewAllSubmissionPage />
  },
  {
    path: "/profile/update-access-token",
    element: (
      <ProtectedRoute>
        <EmailVerifiedPage />
      </ProtectedRoute>
    )
  }
];

export default ProfileRoute;
