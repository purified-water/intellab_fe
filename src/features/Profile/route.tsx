import { ProfilePage, EditProfilePage, ViewAllSubmissionPage } from "./pages";
import { RouteObject } from "react-router-dom";

const ProfileRoute: RouteObject[] = [
  {
    path: "/profile/:id",
    element: <ProfilePage />
  },
  {
    path: "/profile/edit",
    element: <EditProfilePage />
  },
  {
    path: "/profile/submissions",
    element: <ViewAllSubmissionPage />
  }
];

export default ProfileRoute;
