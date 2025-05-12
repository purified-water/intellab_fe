import { RouteObject } from "react-router-dom";
import CourseRoute from "./features/course/route";
import DashboardRoute from "./features/dashboard/route";
import ProblemRoute from "./features/problem/route";
import UserRoute from "./features/user/route";
import { PermissionDeniedPage } from "./pages";

const AdminRoute: RouteObject[] = [
  ...CourseRoute,
  ...DashboardRoute,
  ...ProblemRoute,
  ...UserRoute,
  {
    path: "permission-denied",
    element: <PermissionDeniedPage />
  }
];

export default AdminRoute;
