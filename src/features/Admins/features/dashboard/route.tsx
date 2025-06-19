import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

const DashboardPage = lazy(() => import("./pages").then((module) => ({ default: module.DashboardPage })));

const DashboardRoute: RouteObject[] = [
  {
    index: true,
    path: "dashboard",
    element: <DashboardPage />
  },
  {
    path: "",
    element: <Navigate to="/admin/dashboard" replace />
  }
];

export default DashboardRoute;
