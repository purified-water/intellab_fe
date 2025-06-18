import { RouteObject } from "react-router-dom";
import CourseRoute from "./features/course/route";
import DashboardRoute from "./features/dashboard/route";
import ProblemRoute from "./features/problem/route";
import UserRoute from "./features/user/route";
import TransactionRoute from "./features/transaction/route";
import { PermissionDeniedPage } from "./pages";
import JudgeManagementRoute from "./features/onlineJudge/route";

const AdminRoute: RouteObject[] = [
  ...CourseRoute,
  ...DashboardRoute,
  ...ProblemRoute,
  ...UserRoute,
  ...TransactionRoute,
  ...JudgeManagementRoute,
  {
    path: "permission-denied",
    element: <PermissionDeniedPage />
  }
];

export default AdminRoute;
